import { Request, Response, NextFunction } from 'express';
import Client from '../models/Client';
import { sendTicketEmail } from '../utils/emailService';

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, empresa, cpf, cnpj, emailEmpresa, telefone, whatsapp, endereco } = req.body;

    const newClient = new Client({
      name,
      empresa,
      cpf,
      cnpj,
      emailEmpresa,
      telefone,
      whatsapp,
      endereco
    });

    const saved = await newClient.save();

    const lang = (req.body.lang || 'pt') as any;
    const { getClientEmailTemplate } = await import('../utils/emailTemplates');

    const { subject, html } = getClientEmailTemplate(lang, {
      name,
      empresa,
      idInfo: cpf || cnpj || "N/A",
      emailEmpresa,
      telefone,
      whatsapp,
      endereco
    });

    // Envia e-mail para o cliente
    if (emailEmpresa) {
      await sendTicketEmail(emailEmpresa, subject, html);
    }

    // Envia e-mail para o administrador
    if (process.env.EMAIL_TO) {
      const subjectAdmin = lang === 'pt' ? `Novo Cliente Cadastrado - ${name}` : (lang === 'en' ? `New Client Registered - ${name}` : `Nuevo Cliente Registrado - ${name}`);
      await sendTicketEmail(process.env.EMAIL_TO, subjectAdmin, html);
    }

    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', client: saved });
  } catch (error) {
    next(error);
  }
};
