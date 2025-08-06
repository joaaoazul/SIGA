// =============================================
// EmailInviteTemplate.js - src/services/emails/templates/InviteTemplate.js
// Template de email HTML para convites
// =============================================

export const generateInviteEmailHTML = ({ 
  athleteName, 
  trainerName, 
  inviteLink, 
  personalMessage = null,
  expiresIn = '7 dias' 
}) => {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convite - 180 Performance</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  
  <!-- Container Principal -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Content Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <!-- Logo -->
              <div style="display: inline-block; padding: 12px; background-color: rgba(255,255,255,0.2); border-radius: 12px; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; background-color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  💪
                </div>
              </div>
              
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                180 Performance
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Transforme seu treino. Alcance seus objetivos.
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 8px 0; color: #333333; font-size: 24px; font-weight: 600;">
                Olá ${athleteName}! 👋
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Você foi convidado(a) por <strong style="color: #333333;">${trainerName}</strong> 
                para fazer parte do 180 Performance - a plataforma completa para gestão de treinos e acompanhamento personalizado.
              </p>
              
              ${personalMessage ? `
              <!-- Mensagem Personalizada -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #667eea; font-size: 14px; font-weight: 600;">
                  Mensagem do seu trainer:
                </p>
                <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.5; font-style: italic;">
                  "${personalMessage}"
                </p>
              </div>
              ` : ''}
              
              <!-- Benefits Section -->
              <div style="margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 18px; font-weight: 600;">
                  O que você terá acesso:
                </h3>
                
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                            <div style="color: #22c55e;">✓</div>
                          </td>
                          <td style="color: #666666; font-size: 15px; line-height: 1.4;">
                            Planos de treino personalizados
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                            <div style="color: #22c55e;">✓</div>
                          </td>
                          <td style="color: #666666; font-size: 15px; line-height: 1.4;">
                            Acompanhamento de progresso em tempo real
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                            <div style="color: #22c55e;">✓</div>
                          </td>
                          <td style="color: #666666; font-size: 15px; line-height: 1.4;">
                            Comunicação direta com seu trainer
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                            <div style="color: #22c55e;">✓</div>
                          </td>
                          <td style="color: #666666; font-size: 15px; line-height: 1.4;">
                            Planos nutricionais adaptados
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Aceitar Convite e Começar
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">
                  Ou copie e cole este link no seu navegador:
                </p>
                <p style="margin: 0; word-break: break-all; color: #667eea; font-size: 13px;">
                  ${inviteLink}
                </p>
              </div>
              
              <!-- Expiration Notice -->
              <div style="text-align: center; padding: 16px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  ⏰ <strong>Este convite expira em ${expiresIn}</strong>
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              
              <p style="margin: 0 0 8px 0; color: #999999; font-size: 13px;">
                Este email foi enviado para ${athleteName} porque ${trainerName} te convidou para o 180 Performance.
              </p>
              
              <p style="margin: 0 0 16px 0; color: #999999; font-size: 13px;">
                Tens dúvidas? Contacta o teu trainer ou responde a este email.
              </p>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #999999; font-size: 12px;">
                  © 2024 180 Performance. Todos os direitos reservados.
                </p>
              </div>
              
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;
};

// Template de texto simples (fallback)
export const generateInviteEmailText = ({ 
  athleteName, 
  trainerName, 
  inviteLink, 
  personalMessage = null,
  expiresIn = '7 dias' 
}) => {
  return `
Olá ${athleteName}!

Você foi convidado(a) por ${trainerName} para fazer parte do 180 Performance - a plataforma completa para gestão de treinos e acompanhamento personalizado.

${personalMessage ? `Mensagem do seu trainer:\n"${personalMessage}"\n\n` : ''}

O que você terá acesso:
✓ Planos de treino personalizados
✓ Acompanhamento de progresso em tempo real  
✓ Comunicação direta com seu trainer
✓ Planos nutricionais adaptados

Para aceitar o convite e criar sua conta, clique no link abaixo:
${inviteLink}

⏰ IMPORTANTE: Este convite expira em ${expiresIn}

Tens dúvidas? Contacta o teu trainer ou responde a este email.

---
180 by Binho
© 2025 Todos os direitos reservados. 

SIGA180 - Where Champions Are Made
  `.trim();
};