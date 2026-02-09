import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import { sendTicketEmail } from '../utils/emailService';

export const registerCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, whatsapp, endereco, companyName } = req.body;

    if (password.length < 8) {
      res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'E-mail já cadastrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const companyId = new mongoose.Types.ObjectId().toString();

    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'admin', // First user of a company is always admin
      whatsapp, 
      endereco,
      companyId,
      companyName
    });

    const lang = (req.body.lang || 'pt') as any;
    const { getUserEmailTemplate } = await import('../utils/emailTemplates');

    const { subject, html } = getUserEmailTemplate(lang, {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      whatsapp: newUser.whatsapp,
      endereco: newUser.endereco
    });

    // Envia e-mail de boas-vindas
    await sendTicketEmail(newUser.email, subject, html);

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      companyId: newUser.companyId,
      companyName: newUser.companyName
    });
  } catch (err) {
    next(err);
  }
};
