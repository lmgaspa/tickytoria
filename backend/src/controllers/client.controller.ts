import { Request, Response, NextFunction } from 'express';
import Client from '../models/Client';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { sendTicketEmail } from '../utils/emailService';

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, empresa, cpf, cnpj, emailEmpresa, telefone, whatsapp, endereco, createAccess, password } = req.body;
    const { companyId } = req.user as any;

    const newClient = new Client({
      name,
      empresa,
      cpf,
      cnpj,
      emailEmpresa,
      telefone,
      whatsapp,
      endereco,
      companyId
    });

    const saved = await newClient.save();

    let newUser = null;

    if (createAccess && password && emailEmpresa) {
      // Create a NEW company for this client
      const newCompanyId = new mongoose.Types.ObjectId().toString();
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const existingUser = await User.findOne({ email: emailEmpresa });
      if (!existingUser) {
          newUser = await User.create({
            name,
            email: emailEmpresa,
            password: hashedPassword,
            role: 'client',
            whatsapp,
            endereco,
            companyId: newCompanyId,
            companyName: empresa
          });
      }
    }

    const lang = (req.body.lang || 'pt') as any;
    const { getClientEmailTemplate, getWelcomeEmailTemplate } = await import('../utils/emailTemplates');

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
      // 1. E-mail de confirmação de cadastro (dados gerais)
      await sendTicketEmail(emailEmpresa, subject, html);
      
      // 2. E-mail de boas-vindas com credenciais (se usuário foi criado)
      if (newUser) {
          const welcomeData = getWelcomeEmailTemplate(lang, {
            name,
            email: emailEmpresa,
            password: password, // Send raw password so they can log in
            empresa
          });
          
          await sendTicketEmail(emailEmpresa, welcomeData.subject, welcomeData.html);
      }
    }

    // Envia e-mail para o administrador
    if (process.env.EMAIL_TO) {
      const subjectAdmin = lang === 'pt' ? `Novo Cliente Cadastrado - ${name}` : (lang === 'en' ? `New Client Registered - ${name}` : `Nuevo Cliente Registrado - ${name}`);
      await sendTicketEmail(process.env.EMAIL_TO, subjectAdmin, html);
    }

    res.status(201).json({ 
        message: 'Cliente cadastrado com sucesso!', 
        client: saved,
        accessCreated: !!newUser
    });
  } catch (error) {
    next(error);
  }
};
