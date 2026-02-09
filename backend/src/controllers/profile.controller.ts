import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import { sendTicketEmail } from '../utils/emailService'

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user as { id: string };
    const user = await User.findById(id).select('name email role');

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user as { id: string };
    const { name, currentPassword, newPassword, lang = 'pt' } = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    const changes: string[] = [];
    let passwordUpdated = false;

    // 1. Update Name
    if (name && name !== user.name) {
      user.name = name;
      changes.push('name');
    }

    // 2. Update Password (no current password required)
    if (newPassword) {
      if (newPassword.length < 8) {
        res.status(400).json({ message: 'A nova senha deve ter no mínimo 8 caracteres.' });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 10);
      changes.push('password');
      passwordUpdated = true;
    }

    if (changes.length === 0) {
      // If nothing changed but request was made, just return current user
       res.json({ 
        message: 'Nenhuma alteração realizada.',
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      return;
    }

    await user.save();

    // 3. Send Email Notification
    if (process.env.EMAIL_USER) {
      const { getProfileUpdateEmailTemplate } = await import('../utils/emailTemplates');
       const emailData = {
        name: user.name,
        email: user.email,
        changes
      };
      
      const { subject, html } = getProfileUpdateEmailTemplate(lang as any, emailData);

      await sendTicketEmail(user.email, subject, html);
    }

    res.json({ 
      message: 'Perfil atualizado com sucesso!',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};

