import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

const normalizePhoneNumber = (number: string): string => number.replace(/\D/g, '');

const sanitizeUser = (user: any) => {
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().sort({ role: 1, name: 1 });
    res.json(users.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
};

export const getUserByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.params.name?.trim();
    const users = await User.find({ name: new RegExp(name, 'i') });
    if (!users.length) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.json(users.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
};

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email?.trim();
    const users = await User.find({ email: new RegExp(`^${email}$`, 'i') });
    if (!users.length) {
      return res.status(404).json({ message: 'E-mail não encontrado.' });
    }
    res.json(users.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
};

export const getUserByWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = req.params.whatsapp;
    if (!rawParam) {
      return res.status(400).json({ message: 'WhatsApp não fornecido.' });
    }

    const whatsapp = normalizePhoneNumber(rawParam);
    const users = await User.find();

    const foundUsers = users.filter(
      user =>
        user.whatsapp &&
        normalizePhoneNumber(user.whatsapp) === whatsapp
    );

    if (!foundUsers.length) {
      return res.status(404).json({ message: 'WhatsApp não encontrado.' });
    }

    res.json(foundUsers.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
};

export const getUserByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.params.role?.trim();
    const users = await User.find({ role: new RegExp(`^${role}$`, 'i') });
    if (!users.length) {
      return res.status(404).json({ message: 'Nenhum funcionário encontrado para esta função.' });
    }
    res.json(users.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
};
