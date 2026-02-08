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
