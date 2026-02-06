import { Request, Response, NextFunction } from 'express';
import Client from '../models/Client';

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

    await newClient.save();

    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', client: newClient });
  } catch (error) {
    next(error);
  }
};
