import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendTicketEmail } from '../utils/emailService';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, whatsapp, endereco } = req.body;

    if (password.length < 8) {
      res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    if (role !== 'funcionário') {
      res.status(403).json({ message: 'Somente admin pode registrar funcionário.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Funcionário já existe.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      whatsapp, 
      endereco 
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

    // Envia e-mail para o funcionário
    await sendTicketEmail(
      newUser.email,
      subject,
      html
    );

    // Envia e-mail para o administrador
    if (process.env.EMAIL_TO) {
      const subjectAdmin = lang === 'pt' ? `Tickytoria - Novo Funcionário Criado: ${newUser.name}` : (lang === 'en' ? `Tickytoria - New Employee Created: ${newUser.name}` : `Tickytoria - Nuevo Empleado Creado: ${newUser.name}`);
      await sendTicketEmail(
        process.env.EMAIL_TO,
        subjectAdmin,
        html
      );
    }

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      whatsapp: newUser.whatsapp,
      endereco: newUser.endereco
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
