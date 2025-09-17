// src/modules/trainer/pages/Financials/services/financialService.js

import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const stripePromise = loadStripe(stripePublicKey);

class FinancialService {
  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================
  
  async getDashboardStats(trainerId) {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      // Buscar dados do mês atual
      const { data: currentMonth } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('trainer_id', trainerId)
        .gte('payment_date', startOfMonth.toISOString())
        .lte('payment_date', now.toISOString());
      
      // Buscar dados do mês anterior
      const { data: lastMonth } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('trainer_id', trainerId)
        .gte('payment_date', startOfLastMonth.toISOString())
        .lte('payment_date', endOfLastMonth.toISOString());
      
      // Calcular métricas
      const currentRevenue = currentMonth
        ?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      
      const lastRevenue = lastMonth
        ?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      
      const pendingAmount = currentMonth
        ?.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      
      // Buscar pagamentos em atraso
      const { data: overdue } = await supabase
        .from('overdue_payments')
        .select('*')
        .eq('trainer_id', trainerId);
      
      // Buscar despesas
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('trainer_id', trainerId)
        .gte('expense_date', startOfMonth.toISOString());
      
      const totalExpenses = expenses
        ?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;
      
      // Buscar atletas ativos
      const { data: activeSubscriptions } = await supabase
        .from('athlete_subscriptions')
        .select('id')
        .eq('trainer_id', trainerId)
        .eq('status', 'active');
      
      return {
        revenue: {
          current: currentRevenue,
          previous: lastRevenue,
          growth: lastRevenue > 0 
            ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1)
            : 0,
          pending: pendingAmount
        },
        overdue: {
          amount: overdue?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0,
          count: overdue?.length || 0
        },
        expenses: {
          current: totalExpenses,
          profit: currentRevenue - totalExpenses
        },
        athletes: {
          active: activeSubscriptions?.length || 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
  
  async getRevenueChart(trainerId, period = 'year') {
    try {
      const periods = {
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
      };
      
      const days = periods[period] || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('payments')
        .select('payment_date, amount')
        .eq('trainer_id', trainerId)
        .eq('status', 'paid')
        .gte('payment_date', startDate.toISOString())
        .order('payment_date', { ascending: true });
      
      if (error) throw error;
      
      // Agrupar por dia/semana/mês
      const grouped = data.reduce((acc, payment) => {
        const date = new Date(payment.payment_date);
        const key = period === 'week' || period === 'month' 
          ? date.toISOString().split('T')[0]
          : `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!acc[key]) acc[key] = 0;
        acc[key] += parseFloat(payment.amount);
        return acc;
      }, {});
      
      return Object.entries(grouped).map(([date, amount]) => ({
        date,
        amount
      }));
    } catch (error) {
      console.error('Error fetching revenue chart:', error);
      throw error;
    }
  }
  
  // ==========================================
  // SUBSCRIPTION PLANS
  // ==========================================
  
  async getPlans(trainerId) {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('trainer_id', trainerId)
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }
  
  async createPlan(planData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Criar produto no Stripe
      const stripeProduct = await this.createStripeProduct({
        name: planData.name,
        description: planData.description,
        metadata: {
          trainer_id: user.id,
          plan_id: planData.id
        }
      });
      
      // Criar preço no Stripe
      const stripePrice = await this.createStripePrice({
        product: stripeProduct.id,
        amount: Math.round(planData.price * 100), // Stripe usa centavos
        currency: planData.currency || 'eur',
        recurring: planData.billing_period
      });
      
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert({
          ...planData,
          trainer_id: user.id,
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripePrice.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }
  
  async updatePlan(planId, updates) {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', planId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }
  
  // ==========================================
  // ATHLETE SUBSCRIPTIONS
  // ==========================================
  
  async getSubscriptions(trainerId, filters = {}) {
    try {
      let query = supabase
        .from('athlete_subscriptions')
        .select(`
          *,
          athlete:profiles!athlete_id(
            id,
            full_name,
            email,
            avatar_url
          ),
          plan:subscription_plans!plan_id(
            name,
            price
          )
        `)
        .eq('trainer_id', trainerId);
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.athleteId) {
        query = query.eq('athlete_id', filters.athleteId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }
  
  async createSubscription(subscriptionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Criar customer no Stripe se não existir
      let stripeCustomerId = subscriptionData.stripe_customer_id;
      
      if (!stripeCustomerId) {
        const { data: athlete } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', subscriptionData.athlete_id)
          .single();
        
        const stripeCustomer = await this.createStripeCustomer({
          email: athlete.email,
          name: athlete.full_name,
          metadata: {
            athlete_id: subscriptionData.athlete_id,
            trainer_id: user.id
          }
        });
        
        stripeCustomerId = stripeCustomer.id;
      }
      
      // Buscar plan para obter stripe_price_id
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('stripe_price_id')
        .eq('id', subscriptionData.plan_id)
        .single();
      
      // Criar subscription no Stripe
      const stripeSubscription = await this.createStripeSubscription({
        customer: stripeCustomerId,
        items: [{ price: plan.stripe_price_id }],
        metadata: {
          athlete_id: subscriptionData.athlete_id,
          trainer_id: user.id
        }
      });
      
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('athlete_subscriptions')
        .insert({
          ...subscriptionData,
          trainer_id: user.id,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscription.id,
          next_payment_date: new Date(stripeSubscription.current_period_end * 1000)
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
  
  async cancelSubscription(subscriptionId) {
    try {
      // Buscar subscription
      const { data: subscription } = await supabase
        .from('athlete_subscriptions')
        .select('stripe_subscription_id')
        .eq('id', subscriptionId)
        .single();
      
      // Cancelar no Stripe
      if (subscription.stripe_subscription_id) {
        await this.cancelStripeSubscription(subscription.stripe_subscription_id);
      }
      
      // Atualizar no Supabase
      const { data, error } = await supabase
        .from('athlete_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date(),
          end_date: new Date()
        })
        .eq('id', subscriptionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
  
  // ==========================================
  // PAYMENTS
  // ==========================================
  
  async getPayments(trainerId, filters = {}) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          athlete:profiles!athlete_id(
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('trainer_id', trainerId);
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.athleteId) {
        query = query.eq('athlete_id', filters.athleteId);
      }
      
      if (filters.startDate) {
        query = query.gte('payment_date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('payment_date', filters.endDate);
      }
      
      const { data, error } = await query.order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }
  
  async createPayment(paymentData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('payments')
        .insert({
          ...paymentData,
          trainer_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Criar notificação para o atleta
      await this.createPaymentNotification(data.id, data.athlete_id);
      
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
  
  async markAsPaid(paymentId, method) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date(),
          method: method
        })
        .eq('id', paymentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Criar transação
      await this.createTransaction({
        type: 'payment',
        reference_id: paymentId,
        reference_table: 'payments',
        amount: data.amount,
        description: `Pagamento recebido - ${method}`
      });
      
      return data;
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      throw error;
    }
  }
  
  async processStripePayment(paymentId) {
    try {
      const stripe = await stripePromise;
      
      // Buscar payment details
      const { data: payment } = await supabase
        .from('payments')
        .select(`
          *,
          athlete:profiles!athlete_id(email, full_name)
        `)
        .eq('id', paymentId)
        .single();
      
      // Criar Payment Intent no backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(payment.amount * 100),
          currency: payment.currency || 'eur',
          customer_email: payment.athlete.email,
          metadata: {
            payment_id: paymentId,
            athlete_id: payment.athlete_id,
            trainer_id: payment.trainer_id
          }
        })
      });
      
      const { clientSecret } = await response.json();
      
      // Confirmar pagamento no frontend
      const result = await stripe.confirmCardPayment(clientSecret);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Atualizar payment com stripe IDs
      await supabase
        .from('payments')
        .update({
          stripe_payment_intent_id: result.paymentIntent.id,
          status: 'paid',
          paid_at: new Date()
        })
        .eq('id', paymentId);
      
      return result.paymentIntent;
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      throw error;
    }
  }
  
  // ==========================================
  // INVOICES
  // ==========================================
  
  async getInvoices(trainerId, filters = {}) {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          athlete:profiles!athlete_id(
            id,
            full_name,
            email
          ),
          payment:payments!payment_id(
            status,
            paid_at
          )
        `)
        .eq('trainer_id', trainerId);
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.athleteId) {
        query = query.eq('athlete_id', filters.athleteId);
      }
      
      const { data, error } = await query.order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
  
  async createInvoice(invoiceData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buscar dados fiscais do atleta
      const { data: athlete } = await supabase
        .from('profiles')
        .select('full_name, email, phone, address, nif')
        .eq('id', invoiceData.athlete_id)
        .single();
      
      // Buscar dados fiscais do trainer
      const { data: trainer } = await supabase
        .from('trainer_profiles')
        .select('business_name, business_nif, business_address')
        .eq('user_id', user.id)
        .single();
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          trainer_id: user.id,
          athlete_fiscal_data: athlete,
          trainer_fiscal_data: trainer || {
            business_name: 'Personal Trainer',
            business_nif: '999999990',
            business_address: 'Lisboa, Portugal'
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Gerar PDF
      await this.generateInvoicePDF(data.id);
      
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }
  
  async sendInvoice(invoiceId) {
    try {
      // Buscar invoice
      const { data: invoice } = await supabase
        .from('invoices')
        .select(`
          *,
          athlete:profiles!athlete_id(email, full_name)
        `)
        .eq('id', invoiceId)
        .single();
      
      // Enviar email
      const response = await fetch('/api/send-invoice-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: invoice.athlete.email,
          invoice: invoice
        })
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      
      // Atualizar status
      await supabase
        .from('invoices')
        .update({
          status: 'sent',
          sent_at: new Date()
        })
        .eq('id', invoiceId);
      
      return true;
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  }
  
  async generateInvoicePDF(invoiceId) {
    try {
      // Implementar geração de PDF (usar biblioteca como jsPDF ou chamar API)
      // Por agora, retornar URL mock
      const pdfUrl = `/api/invoices/${invoiceId}/pdf`;
      
      await supabase
        .from('invoices')
        .update({ pdf_url: pdfUrl })
        .eq('id', invoiceId);
      
      return pdfUrl;
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  }
  
  // ==========================================
  // EXPENSES
  // ==========================================
  
  async getExpenses(trainerId, filters = {}) {
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('trainer_id', trainerId);
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.startDate) {
        query = query.gte('expense_date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('expense_date', filters.endDate);
      }
      
      const { data, error } = await query.order('expense_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }
  
  async createExpense(expenseData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          trainer_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Criar transação
      await this.createTransaction({
        type: 'expense',
        reference_id: data.id,
        reference_table: 'expenses',
        amount: -data.amount, // Negativo para despesas
        description: `Despesa: ${data.description}`
      });
      
      return data;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }
  
  // ==========================================
  // TRANSACTIONS & REPORTS
  // ==========================================
  
  async createTransaction(transactionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buscar saldo atual
      const { data: lastTransaction } = await supabase
        .from('financial_transactions')
        .select('balance_after')
        .eq('trainer_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(1)
        .single();
      
      const balanceBefore = lastTransaction?.balance_after || 0;
      const balanceAfter = balanceBefore + parseFloat(transactionData.amount);
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transactionData,
          trainer_id: user.id,
          balance_before: balanceBefore,
          balance_after: balanceAfter
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
  
  async getFinancialReport(trainerId, startDate, endDate) {
    try {
      // Receitas
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status, payment_date')
        .eq('trainer_id', trainerId)
        .eq('status', 'paid')
        .gte('payment_date', startDate)
        .lte('payment_date', endDate);
      
      // Despesas
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, category, expense_date')
        .eq('trainer_id', trainerId)
        .gte('expense_date', startDate)
        .lte('expense_date', endDate);
      
      // Calcular totais
      const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      const totalExpenses = expenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;
      const profit = totalRevenue - totalExpenses;
      
      // Agrupar por categoria
      const expensesByCategory = expenses?.reduce((acc, expense) => {
        if (!acc[expense.category]) acc[expense.category] = 0;
        acc[expense.category] += parseFloat(expense.amount);
        return acc;
      }, {});
      
      return {
        period: { startDate, endDate },
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: profit,
        profitMargin: totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(1) : 0,
        expensesByCategory: expensesByCategory,
        transactions: {
          payments: payments?.length || 0,
          expenses: expenses?.length || 0
        }
      };
    } catch (error) {
      console.error('Error generating financial report:', error);
      throw error;
    }
  }
  
  // ==========================================
  // STRIPE HELPERS (chamar backend API)
  // ==========================================
  
  async createStripeProduct(data) {
    const response = await fetch('/api/stripe/create-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async createStripePrice(data) {
    const response = await fetch('/api/stripe/create-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async createStripeCustomer(data) {
    const response = await fetch('/api/stripe/create-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async createStripeSubscription(data) {
    const response = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async cancelStripeSubscription(subscriptionId) {
    const response = await fetch(`/api/stripe/cancel-subscription/${subscriptionId}`, {
      method: 'POST'
    });
    return response.json();
  }
  
  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  
  async createPaymentNotification(paymentId, athleteId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: athleteId,
          type: 'payment_reminder',
          title: 'Pagamento Pendente',
          message: 'Tem um pagamento pendente. Por favor, regularize a sua situação.',
          data: { payment_id: paymentId }
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
  
  async sendPaymentReminders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buscar pagamentos em atraso
      const { data: overduePayments } = await supabase
        .from('overdue_payments')
        .select('*')
        .eq('trainer_id', user.id);
      
      const results = [];
      
      for (const payment of overduePayments) {
        // Criar reminder
        const { data: reminder } = await supabase
          .from('payment_reminders')
          .insert({
            payment_id: payment.id,
            athlete_id: payment.athlete_id,
            trainer_id: user.id,
            reminder_date: new Date(),
            reminder_type: 'email',
            subject: 'Lembrete de Pagamento',
            message: `O seu pagamento de €${payment.amount} está em atraso há ${payment.days_overdue} dias.`
          })
          .select()
          .single();
        
        // Enviar email (chamar API)
        await fetch('/api/send-payment-reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reminder)
        });
        
        results.push(reminder);
      }
      
      return results;
    } catch (error) {
      console.error('Error sending payment reminders:', error);
      throw error;
    }
  }
}

export default new FinancialService();