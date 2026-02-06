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

    const html = `
      <p><strong>Tickytoria</strong></p>
      <p>Olá <strong>Tom Passinho</strong>,</p>
      <p>O funcionário <strong>${newUser.name}</strong> foi criado com sucesso.</p>
      <p><strong>E-mail:</strong> ${newUser.email}</p>
      <p><strong>Função:</strong> ${newUser.role}</p>
      <p><strong>WhatsApp:</strong> ${newUser.whatsapp || 'N/A'}</p>
      <p><strong>Endereço:</strong> ${newUser.endereco || 'N/A'}</p>
    `;

    if (process.env.EMAIL_TO) {
      await sendTicketEmail(
        process.env.EMAIL_TO,
        'Tickytoria - Funcionário criado com sucesso',
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
