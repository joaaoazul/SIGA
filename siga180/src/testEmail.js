

const { Resend } = require('resend');

// ⚠️ IMPORTANTE: Substitui estes valores pelos teus!
const RESEND_API_KEY = 're_S5dfs3Wo_FQJL9uLS3MwD6t3BFVYfGKVE'; // A tua API key do Resend
const TEST_EMAIL = 'joaoazul74@gmail.com';    // Onde vais receber o teste

async function testEmail() {
  console.log('🧪 A testar configuração de email...\n');
  
  const resend = new Resend(RESEND_API_KEY);
  
  try {
    console.log('📧 Enviando email de teste...');
    
    const { data, error } = await resend.emails.send({
      from: '180 Performance <noreply@siga180.pt>',
      to: TEST_EMAIL,
      subject: '✅ Teste Resend - Funciona!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; margin-top: -10px; }
            .success-box { background: #10b981; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-table { width: 100%; margin: 20px 0; }
            .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .info-table td:first-child { font-weight: bold; width: 40%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Teste de Email Bem Sucedido!</h1>
            </div>
            
            <div class="content">
              <div class="success-box">
                <h2 style="margin: 0;">✅ Tudo está a funcionar!</h2>
                <p style="margin: 10px 0 0 0;">O sistema de emails está configurado corretamente.</p>
              </div>
              
              <h3>Informações do Teste:</h3>
              <table class="info-table">
                <tr>
                  <td>Data/Hora:</td>
                  <td>${new Date().toLocaleString('pt-PT')}</td>
                </tr>
                <tr>
                  <td>Domínio:</td>
                  <td>siga180.pt</td>
                </tr>
                <tr>
                  <td>Serviço:</td>
                  <td>Resend</td>
                </tr>
                <tr>
                  <td>Região:</td>
                  <td>EU-West-1 (Ireland)</td>
                </tr>
                <tr>
                  <td>Status DNS:</td>
                  <td>✅ Verificado</td>
                </tr>
              </table>
              
              <h3>Próximos Passos:</h3>
              <ul>
                <li>✅ DNS configurado no Vercel</li>
                <li>✅ Domínio verificado no Resend</li>
                <li>✅ API Key funcionando</li>
                <li>✅ Emails a chegar na inbox</li>
                <li>⏭️ Pronto para usar em produção!</li>
              </ul>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; color: #666;">
                  <strong>Nota:</strong> Se este email chegou ao SPAM, marca como "Não é spam" para melhorar a entrega futura.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: 'Teste de email - Se estás a ler isto, funciona!'
    });

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    console.log('✅ Email enviado com sucesso!');
    console.log('📬 ID:', data.id);
    console.log('\n🎯 Verifica a tua caixa de entrada:', TEST_EMAIL);
    console.log('📨 (Se for para SPAM na primeira vez, é normal)\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n🔍 Possíveis problemas:');
    console.log('1. API Key incorreta');
    console.log('2. Domínio não verificado');
    console.log('3. Problema de rede\n');
  }
}

// Executar teste
console.log('========================================');
console.log('   TESTE DE EMAIL - 180 PERFORMANCE    ');
console.log('========================================\n');

testEmail();