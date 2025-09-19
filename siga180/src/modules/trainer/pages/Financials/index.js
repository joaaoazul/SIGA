// src/modules/trainer/pages/Financials/index.js

import { lazy } from 'react';

export { default } from './FinancialsPage';
export { default as FinancialsPage } from './FinancialsPage';


export const DashboardView = lazy(() => 
  import('./views/DashboardView').then(module => ({ default: module.default || DashboardView }))
);

export const PaymentsView = lazy(() => 
  import('./views/PaymentsView').then(module => ({ default: module.default || PaymentsView }))
);

export const SubscriptionsView = lazy(() => 
  import('./views/SubscriptionsView').then(module => ({ default: module.default || SubscriptionsView }))
);

export const InvoicesView = lazy(() => 
  import('./views/InvoicesView').then(module => ({ default: module.default || InvoicesView }))
);

export const ExpensesView = lazy(() => 
  import('./views/ExpensesView').then(module => ({ default: module.default || ExpensesView }))
);

export const ReportsView = lazy(() => 
  import('./views/ReportsView').then(module => ({ default: module.default || ReportsView }))
);

// ============================================
// SERVICES
// ============================================
export { default as financialService } from './services/financialService';
export { default as stripeService } from './services/stripeService';
export { default as invoiceService } from './services/invoiceService';
export { default as reportService } from './services/reportService';

// ============================================
// HOOKS
// ============================================
export { useFinancials } from './hooks/useFinancials';
export { usePayments } from './hooks/usePayments';
export { useSubscriptions } from './hooks/useSubscriptions';
export { useInvoices } from './hooks/useInvoices';
export { useStripe } from './hooks/useStripe';

// ============================================
// COMPONENTS - Cards
// ============================================
export { default as StatsCard } from './components/cards/StatsCard';
export { default as PaymentCard } from './components/cards/PaymentCard';
export { default as SubscriptionCard } from './components/cards/SubscriptionCard';
export { default as InvoiceCard } from './components/cards/InvoiceCard';
export { default as RevenueCard } from './components/cards/RevenueCard';

// ============================================
// COMPONENTS - Modals
// ============================================
export { default as ProcessPaymentModal } from './components/modals/ProcessPaymentModal';
export { default as CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
export { default as StripeCheckoutModal } from './components/modals/StripeCheckoutModal';
export { default as AddExpenseModal } from './components/modals/AddExpenseModal';
export { default as CreateSubscriptionModal } from './components/modals/CreateSubscriptionModal';

// ============================================
// COMPONENTS - Charts
// ============================================
export { default as RevenueChart } from './components/charts/RevenueChart';
export { default as ExpenseChart } from './components/charts/ExpenseChart';
export { default as ProfitChart } from './components/charts/ProfitChart';
export { default as CashflowChart } from './components/charts/CashflowChart';

// ============================================
// COMPONENTS - Tables
// ============================================
export { default as PaymentsTable } from './components/tables/PaymentsTable';
export { default as SubscriptionsTable } from './components/tables/SubscriptionsTable';
export { default as InvoicesTable } from './components/tables/InvoicesTable';
export { default as ExpensesTable } from './components/tables/ExpensesTable';

// ============================================
// COMPONENTS - Forms
// ============================================
export { default as PaymentForm } from './components/forms/PaymentForm';
export { default as InvoiceForm } from './components/forms/InvoiceForm';
export { default as SubscriptionForm } from './components/forms/SubscriptionForm';
export { default as ExpenseForm } from './components/forms/ExpenseForm';

// ============================================
// UTILS
// ============================================
export * from './utils/formatters';
export * from './utils/validators';
export * from './utils/calculations';
export * from './utils/constants';

// ============================================
// TYPES (se usares TypeScript)
// ============================================
// export * from './types';

// ============================================
// CONSTANTS & CONFIGS
// ============================================
export const FINANCIAL_ROUTES = {
  ROOT: '/financials',
  DASHBOARD: '/financials/dashboard',
  PAYMENTS: '/financials/payments',
  SUBSCRIPTIONS: '/financials/subscriptions',
  INVOICES: '/financials/invoices',
  EXPENSES: '/financials/expenses',
  REPORTS: '/financials/reports',
  SETTINGS: '/financials/settings'
};

export const FINANCIAL_PERMISSIONS = {
  VIEW_DASHBOARD: 'financials.view_dashboard',
  MANAGE_PAYMENTS: 'financials.manage_payments',
  CREATE_INVOICES: 'financials.create_invoices',
  VIEW_REPORTS: 'financials.view_reports',
  MANAGE_SUBSCRIPTIONS: 'financials.manage_subscriptions',
  EXPORT_DATA: 'financials.export_data'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing'
};

// ============================================
// API ENDPOINTS
// ============================================
export const FINANCIAL_API = {
  // Payments
  PAYMENTS: '/api/payments',
  PAYMENT_DETAILS: (id) => `/api/payments/${id}`,
  PROCESS_PAYMENT: '/api/payments/process',
  REFUND_PAYMENT: (id) => `/api/payments/${id}/refund`,
  
  // Subscriptions
  SUBSCRIPTIONS: '/api/subscriptions',
  SUBSCRIPTION_DETAILS: (id) => `/api/subscriptions/${id}`,
  CANCEL_SUBSCRIPTION: (id) => `/api/subscriptions/${id}/cancel`,
  
  // Invoices
  INVOICES: '/api/invoices',
  INVOICE_DETAILS: (id) => `/api/invoices/${id}`,
  SEND_INVOICE: (id) => `/api/invoices/${id}/send`,
  DOWNLOAD_INVOICE: (id) => `/api/invoices/${id}/download`,
  
  // Reports
  REVENUE_REPORT: '/api/reports/revenue',
  EXPENSE_REPORT: '/api/reports/expenses',
  PROFIT_REPORT: '/api/reports/profit',
  EXPORT_REPORT: '/api/reports/export',
  
  // Dashboard
  DASHBOARD_STATS: '/api/dashboard/stats',
  DASHBOARD_CHARTS: '/api/dashboard/charts',
  
  // Stripe
  STRIPE_CREATE_SESSION: '/api/stripe/create-session',
  STRIPE_CREATE_INTENT: '/api/stripe/create-intent',
  STRIPE_WEBHOOK: '/api/stripe/webhook'
};

// ============================================
// DEFAULT CONFIGS
// ============================================
export const DEFAULT_CURRENCY = 'EUR';
export const DEFAULT_TAX_RATE = 23; // IVA Portugal
export const DEFAULT_PAYMENT_TERMS = 30; // dias
export const DEFAULT_LATE_FEE = 2; // percentagem

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getFinancialModuleInfo = () => ({
  name: 'Financial Management',
  version: '1.0.0',
  description: 'Complete financial management system with Stripe integration',
  author: 'SIGA180 Team',
  features: [
    'Payment Processing',
    'Subscription Management',
    'Invoice Generation',
    'Financial Reports',
    'Expense Tracking',
    'Revenue Analytics'
  ]
});

// ============================================
// INITIALIZATION
// ============================================
export const initializeFinancialModule = async () => {
  console.log('[Financials] Module initialized');
  
  // Verificar dependências
  const dependencies = {
    stripe: typeof window.Stripe !== 'undefined',
    supabase: typeof window.supabase !== 'undefined',
    recharts: true // Assumindo que está instalado
  };
  
  // Verificar configuração
  const config = {
    stripeKey: !!process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    supabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
    supabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY
  };
  
  const isReady = Object.values(dependencies).every(v => v) && 
                   Object.values(config).every(v => v);
  
  if (!isReady) {
    console.warn('[Financials] Missing dependencies or configuration:', {
      dependencies,
      config
    });
  }
  
  return {
    ready: isReady,
    dependencies,
    config
  };
};

// ============================================
// ERROR HANDLING
// ============================================
export class FinancialError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'FinancialError';
    this.code = code;
    this.details = details;
  }
}

export class PaymentError extends FinancialError {
  constructor(message, details) {
    super(message, 'PAYMENT_ERROR', details);
    this.name = 'PaymentError';
  }
}

export class InvoiceError extends FinancialError {
  constructor(message, details) {
    super(message, 'INVOICE_ERROR', details);
    this.name = 'InvoiceError';
  }
}

export class StripeError extends FinancialError {
  constructor(message, details) {
    super(message, 'STRIPE_ERROR', details);
    this.name = 'StripeError';
  }
}

// ============================================
// MODULE METADATA
// ============================================
export const MODULE_METADATA = {
  id: 'financials',
  name: 'Financial Management',
  icon: 'DollarSign',
  color: '#10b981',
  permissions: Object.values(FINANCIAL_PERMISSIONS),
  routes: Object.values(FINANCIAL_ROUTES),
  dependencies: ['@stripe/stripe-js', 'recharts', '@supabase/supabase-js'],
  version: '1.0.0',
  lastUpdated: '2025-01-01'
};

// Log de inicialização (desenvolvimento apenas)
if (process.env.NODE_ENV === 'development') {
  console.log('💰 Financial Module Loaded:', MODULE_METADATA);
}

// Export default para compatibilidade