export type Language = 'en' | 'pt' | 'es';

interface TicketEmailData {
  cliente: string;
  empresa: string;
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  whatsapp?: string;
  emailEmpresa: string;
  descricaoServico: string;
  notaServico: string;
  formattedDate: string;
}

interface ClientEmailData {
  name: string;
  empresa: string;
  idInfo: string;
  emailEmpresa: string;
  telefone?: string;
  whatsapp?: string;
  endereco: string;
}

interface UserEmailData {
  name: string;
  email: string;
  role: string;
  whatsapp?: string;
  endereco?: string;
}

// Helper for consistent branding
const getBrandedHtml = (content: string, lang: Language) => {
  const footerText = {
    pt: 'Powered by AndesCore Software',
    en: 'Powered by AndesCore Software',
    es: 'Powered by AndesCore Software'
  };

  // Navbar colors
  const navbarBg = '#0f0f1b'; // Dark background
  const borderBottom = '1px solid rgba(0, 255, 163, 0.2)';
  
  // Gradient text style for email (with fallback)
  const gradientStyle = `
    background: linear-gradient(135deg, #00ffa3 0%, #03e9f4 25%, #9d50ff 50%, #ff006e 75%, #ffbe0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #00ffa3; /* Fallback color */
    font-size: 28px;
    letter-spacing: 1px;
    font-weight: bold;
    margin: 0;
    display: inline-block;
  `;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <!-- Header with Navbar Look -->
      <div style="background-color: ${navbarBg}; padding: 20px; text-align: center; border-bottom: ${borderBottom};">
        <h1 style="${gradientStyle}">Tickytoria</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px; background-color: #ffffff; color: #000000; line-height: 1.6;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #000000; border-top: 1px solid #eeeeee;">
        <p style="margin: 0;">${footerText[lang]}</p>
        <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Tickytoria. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getTicketEmailTemplate = (lang: Language, data: TicketEmailData) => {
  const subjects = {
    pt: `Confirmação da Criação da Nota de Serviço - ${data.notaServico}`,
    en: `Service Order Confirmation - ${data.notaServico}`,
    es: `Confirmación de Orden de Servicio - ${data.notaServico}`
  };

  const welcomes = {
    pt: 'Sua nota de serviço foi registrada com sucesso com os seguintes detalhes:',
    en: 'Your service order has been successfully registered with the following details:',
    es: 'Su orden de servicio ha sido registrada con éxito con los siguientes detalles:'
  };

  const labels = {
    pt: { client: 'Cliente', company: 'Empresa', phone: 'Telefone', email: 'E-mail', title: 'Título', note: 'Nota de Serviço', date: 'Data' },
    en: { client: 'Client', company: 'Company', phone: 'Phone', email: 'Email', title: 'Title', note: 'Service Note', date: 'Date' },
    es: { client: 'Cliente', company: 'Empresa', phone: 'Teléfono', email: 'Correo electrónico', title: 'Título', note: 'Nota de Servicio', date: 'Fecha' }
  };

  const footerMsg = {
    pt: 'Responderemos em breve!',
    en: 'We will respond shortly!',
    es: '¡Responderemos pronto!'
  };

  const l = labels[lang];

  const content = `
    <h2 style="color: #333; margin-top: 0;">${welcomes[lang]}</h2>
    <ul style="list-style: none; padding: 0;">
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.client}:</strong> ${data.cliente}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.company}:</strong> ${data.empresa}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>CPF/CNPJ:</strong> ${data.cpf || data.cnpj || "N/A"}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.phone}:</strong> ${data.telefone || "N/A"}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>WhatsApp:</strong> ${data.whatsapp || "N/A"}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.email}:</strong> ${data.emailEmpresa}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.title}:</strong> ${data.descricaoServico}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.note}:</strong> ${data.notaServico}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.date}:</strong> ${data.formattedDate}</li>
    </ul>
    <p style="margin-top: 20px; font-weight: bold; color: #4A90E2;">${footerMsg[lang]}</p>
  `;

  return { subject: subjects[lang], html: getBrandedHtml(content, lang) };
};

export const getClientEmailTemplate = (lang: Language, data: ClientEmailData) => {
  const subjects = {
    pt: 'Bem-vindo à Tickytoria - Cadastro Realizado',
    en: 'Welcome to Tickytoria - Registration Complete',
    es: 'Bienvenido a Tickytoria - Registro Completado'
  };

  const welcomes = {
    pt: 'Seu cadastro como cliente foi realizado com sucesso!',
    en: 'Your registration as a client was successful!',
    es: '¡Su registro como cliente se ha realizado con éxito!'
  };

  const labels = {
    pt: { name: 'Nome', company: 'Empresa', email: 'E-mail', phone: 'Telefone', address: 'Endereço', welcome: 'Bem-vindo à Tickytoria!' },
    en: { name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', address: 'Address', welcome: 'Welcome to Tickytoria!' },
    es: { name: 'Nombre', company: 'Empresa', email: 'Correo electrónico', phone: 'Teléfono', address: 'Dirección', welcome: '¡Bienvenido a Tickytoria!' }
  };

  const l = labels[lang];

  const content = `
    <h2 style="color: #333; margin-top: 0;">${welcomes[lang]}</h2>
    <ul style="list-style: none; padding: 0;">
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.name}:</strong> ${data.name}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.company}:</strong> ${data.empresa}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>CPF/CNPJ:</strong> ${data.idInfo}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.email}:</strong> ${data.emailEmpresa}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.phone}:</strong> ${data.telefone || "N/A"}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>WhatsApp:</strong> ${data.whatsapp || "N/A"}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.address}:</strong> ${data.endereco}</li>
    </ul>
    <p style="margin-top: 20px; color: #4A90E2; font-weight: bold;">${l.welcome}</p>
  `;

  return { subject: subjects[lang], html: getBrandedHtml(content, lang) };
};

export const getUserEmailTemplate = (lang: Language, data: UserEmailData) => {
  const subjects = {
    pt: 'Tickytoria - Seu acesso foi criado',
    en: 'Tickytoria - Your access has been created',
    es: 'Tickytoria - Tu acceso ha sido creado'
  };

  const welcomes = {
    pt: `Olá <strong>${data.name}</strong>, seu acesso à plataforma Tickytoria foi criado.`,
    en: `Hello <strong>${data.name}</strong>, your access to the Tickytoria platform has been created.`,
    es: `Hola <strong>${data.name}</strong>, tu acceso a la plataforma Tickytoria ha sido creado.`
  };

  const labels = {
    pt: { email: 'E-mail de acesso', role: 'Função', address: 'Endereço', login: 'Agora você pode acessar o sistema com suas credenciais.' },
    en: { email: 'Access Email', role: 'Role', address: 'Address', login: 'You can now access the system with your credentials.' },
    es: { email: 'Correo de acceso', role: 'Función', address: 'Dirección', login: 'Ahora puedes acceder al sistema con tus credenciales.' }
  };

  const l = labels[lang];

  const content = `
    <h2 style="color: #333; margin-top: 0;">Cadastro de Funcionário</h2>
    <p>${welcomes[lang]}</p>
    <ul style="list-style: none; padding: 0;">
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.email}:</strong> ${data.email}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.role}:</strong> ${data.role}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>WhatsApp:</strong> ${data.whatsapp || 'N/A'}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${l.address}:</strong> ${data.endereco || 'N/A'}</li>
    </ul>
    <p style="margin-top: 20px;">${l.login}</p>
  `;

  return { subject: subjects[lang], html: getBrandedHtml(content, lang) };
};

export const getResetPasswordTemplate = (lang: Language, resetLink: string) => {
  const subjects = {
    pt: 'Tickytoria - Redefinição de senha',
    en: 'Tickytoria - Password Reset',
    es: 'Tickytoria - Restablecimiento de contraseña'
  };

  const titles = {
    pt: 'Redefinição de Senha',
    en: 'Password Reset',
    es: 'Restablecimiento de Contraseña'
  };

  const messages = {
    pt: 'Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha:',
    en: 'You requested a password reset. Click the button below to create a new password:',
    es: 'Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:'
  };

  const buttons = {
    pt: 'Redefinir Minha Senha',
    en: 'Reset My Password',
    es: 'Restablecer Mi Contraseña'
  };

  const ignore = {
    pt: 'Se você não solicitou isso, pode ignorar este e-mail com segurança.',
    en: 'If you did not request this, you can safely ignore this email.',
    es: 'Si no has solicitado esto, puedes ignorar este correo de forma segura.'
  };

  const content = `
    <h2 style="color: #333;">${titles[lang]}</h2>
    <p style="font-size: 16px;">${messages[lang]}</p>
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="${resetLink}" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
        ${buttons[lang]}
      </a>
    </div>
    
    <p style="color: #777; font-size: 14px;">${ignore[lang]}</p>
  `;

  return { subject: subjects[lang], html: getBrandedHtml(content, lang) };
};

export const getWelcomeEmailTemplate = (lang: Language, data: { name: string; email: string; password: string; empresa: string }) => {
  const subjects = {
    pt: 'Bem-vindo ao Tickytoria - Suas Credenciais de Acesso',
    en: 'Welcome to Tickytoria - Your Access Credentials',
    es: 'Bienvenido a Tickytoria - Sus Credenciales de Acceso'
  };

  const titles = {
    pt: 'Bem-vindo ao Tickytoria!',
    en: 'Welcome to Tickytoria!',
    es: '¡Bienvenido a Tickytoria!'
  };

  const messages = {
    pt: `Olá <strong>${data.name}</strong>, sua conta corporativa para <strong>${data.empresa}</strong> foi criada com sucesso.`,
    en: `Hello <strong>${data.name}</strong>, your corporate account for <strong>${data.empresa}</strong> has been successfully created.`,
    es: `Hola <strong>${data.name}</strong>, su cuenta corporativa para <strong>${data.empresa}</strong> ha sido creada con éxito.`
  };

  const credentialsTitle = {
    pt: 'Suas Credenciais de Acesso:',
    en: 'Your Access Credentials:',
    es: 'Sus Credenciales de Acceso:'
  };

  const labels = {
    pt: { email: 'E-mail', password: 'Senha Temporária' },
    en: { email: 'Email', password: 'Temporary Password' },
    es: { email: 'Correo', password: 'Contraseña Temporal' }
  };

  const instructionHeaders = {
    pt: 'Instruções de Segurança:',
    en: 'Security Instructions:',
    es: 'Instrucciones de Seguridad:'
  };

  const instruction = {
    pt: 'Recomendamos que você altere sua senha no menu "Configurações" após o primeiro login.',
    en: 'We recommend that you change your password in the "Settings" menu after your first login.',
    es: 'Le recomendamos que cambie su contraseña en el menú "Configuración" después del primer inicio de sesión.'
  };

  const buttonText = {
    pt: 'Acessar Sistema',
    en: 'Access System',
    es: 'Acceder al Sistema'
  };

  const l = labels[lang];

  const content = `
    <h2 style="color: #333; margin-top: 0; margin-bottom: 20px;">${titles[lang]}</h2>
    <p style="font-size: 16px; line-height: 1.5; color: #555;">${messages[lang]}</p>
    
    <div style="background-color: #f8f9fa; border-left: 4px solid #4A90E2; padding: 20px; margin: 25px 0; border-radius: 4px;">
      <h3 style="margin-top: 0; color: #4A90E2; font-size: 18px; margin-bottom: 15px;">${credentialsTitle[lang]}</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
          <strong style="color: #333;">${l.email}:</strong> <span style="color: #555;">${data.email}</span>
        </li>
        <li style="padding: 8px 0;">
          <strong style="color: #333;">${l.password}:</strong> <span style="background-color: #e9ecef; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #d63384;">${data.password}</span>
        </li>
      </ul>
    </div>

    <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
      <strong style="display: block; margin-bottom: 5px;">${instructionHeaders[lang]}</strong>
      ${instruction[lang]}
    </div>

    <div style="margin: 35px 0; text-align: center;">
      <a href="https://tickytoria-d1c0ff69e067.herokuapp.com/login" style="background-color: #00cca3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${buttonText[lang]}
      </a>
    </div>
  `;

  return { subject: subjects[lang], html: getBrandedHtml(content, lang) };
};

export const getProfileUpdateEmailTemplate = (lang: Language, data: { name: string; email: string; changes: string[] }) => {
  const subjects = {
    pt: 'Tickytoria - Atualização de Perfil',
    en: 'Tickytoria - Profile Update',
    es: 'Tickytoria - Actualización de Perfil'
  };

  const titles = {
    pt: 'Atualização de Perfil',
    en: 'Profile Update',
    es: 'Actualización de Perfil'
  };

  const messages = {
    pt: `Olá <strong>${data.name}</strong>, as seguintes informações do seu perfil foram atualizadas com sucesso:`,
    en: `Hello <strong>${data.name}</strong>, the following information in your profile has been successfully updated:`,
    es: `Hola <strong>${data.name}</strong>, la siguiente información de su perfil se ha actualizado con éxito:`
  };

  const changesList = data.changes.map(change => {
    const changeMap: Record<string, Record<string, string>> = {
      name: { pt: 'Nome', en: 'Name', es: 'Nombre' },
      password: { pt: 'Senha', en: 'Password', es: 'Contraseña' }
    };
    const label = changeMap[change]?.[lang] || change;
    return `
      <li style="padding: 12px 15px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
        <span style="color: #28a745; font-size: 1.2em; margin-right: 10px;">✓</span> 
        <strong>${label}</strong>
      </li>
    `;
  }).join('');

  const securityNote = {
    pt: 'Se você não realizou essas alterações, entre em contato com o suporte ou altere sua senha imediatamente.',
    en: 'If you did not make these changes, please contact support or change your password immediately.',
    es: 'Si no realizó estos cambios, comuníquese con el soporte o cambie su contraseña de inmediato.'
  };

  const content = `
    <h2 style="color: #333; margin-top: 0;">${titles[lang]}</h2>
    <p style="font-size: 16px; color: #555;">${messages[lang]}</p>
    
    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${changesList}
      </ul>
    </div>

    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; color: #856404; padding: 15px; margin-top: 25px; border-radius: 4px;">
      <strong style="display: block; margin-bottom: 5px;">⚠️ Segurança / Security</strong>
      ${securityNote[lang]}
    </div>
    
    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
      <p>IP: ${data.email} | ${new Date().toLocaleString()}</p>
    </div>
  `;

  return { subject: subjects[lang], html: getBrandedHtml(content, lang) };
};
