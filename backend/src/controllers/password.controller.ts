import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import nodemailer from 'nodemailer'

export const forgotPassword = async (req: Request, res: Response) => {
  const { email, lang = 'pt' } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' })

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const resetLink = `${frontendUrl}/reset-password?token=${token}`

  const { getResetPasswordTemplate } = await import('../utils/emailTemplates');
  const { subject, html } = getResetPasswordTemplate(lang as any, resetLink);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Using EMAIL_USER based on .env consistency check
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html
  })

  // Mask email for response
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 2 
    ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
    : localPart + '*'; // Fallback for very short emails
    
  const maskedEmail = `${maskedLocal}@${domain}`;

  return res.json({ message: 'Link enviado', maskedEmail })
}

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const hashed = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(decoded.id, { password: hashed })

    return res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido ou expirado.' })
  }
}
