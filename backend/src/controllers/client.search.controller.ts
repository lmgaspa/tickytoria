import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Client from '../models/Client';

const formatResult = (client: any) => ({
  ...client.toObject(),
  createdAt: format(client.createdAt ?? new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
});

const normalizePhoneNumber = (number: string): string => number.replace(/\D/g, '');

export const getAllClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.user as any;
    const clients = await Client.find({ companyId }).sort({ createdAt: -1 });
    res.json(clients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.params.name?.trim();
    const { companyId } = req.user as any;
    const clients = await Client.find({ name: new RegExp(`^${name}$`, 'i'), companyId });
    if (!clients.length)
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.json(clients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByCpf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cpf = req.params.cpf?.trim();
    const { companyId } = req.user as any;
    const clients = await Client.find({ cpf: new RegExp(`^${cpf}$`, 'i'), companyId });
    if (!clients.length)
      return res.status(404).json({ message: 'CPF não encontrado.' });
    res.json(clients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByCnpj = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cnpj = req.params.cnpj?.trim();
    const { companyId } = req.user as any;
    const clients = await Client.find({ cnpj: new RegExp(`^${cnpj}$`, 'i'), companyId });
    if (!clients.length)
      return res.status(404).json({ message: 'CNPJ não encontrado.' });
    res.json(clients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email?.trim();
    const { companyId } = req.user as any;
    const clients = await Client.find({ emailEmpresa: new RegExp(`^${email}$`, 'i'), companyId });
    if (!clients.length)
      return res.status(404).json({ message: 'E-mail não encontrado.' });
    res.json(clients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresa = req.params.empresa?.trim();
    const { companyId } = req.user as any;
    const clients = await Client.find({ empresa: new RegExp(`${empresa}`, 'i'), companyId });
    if (!clients.length)
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    res.json(clients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = req.params.whatsapp;
    if (!rawParam) {
      return res.status(400).json({ message: 'WhatsApp não fornecido.' });
    }

    const whatsapp = normalizePhoneNumber(rawParam);
    const { companyId } = req.user as any;
    const clients = await Client.find({ companyId });
    
    // Filter locally to handle normalization format differences if stored differently
    const foundClients = clients.filter(
      client =>
        client.whatsapp &&
        normalizePhoneNumber(client.whatsapp) === whatsapp
    );

    if (!foundClients.length) {
      return res.status(404).json({ message: 'WhatsApp não encontrado.' });
    }

    res.json(foundClients.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getClientByTelefone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = req.params.telefone;
    if (!rawParam) {
      return res.status(400).json({ message: 'Telefone não fornecido.' });
    }

    const telefone = normalizePhoneNumber(rawParam);
    const { companyId } = req.user as any;
    const clients = await Client.find({ companyId });

    const foundClients = clients.filter(
      client =>
        client.telefone &&
        normalizePhoneNumber(client.telefone) === telefone
    );

    if (!foundClients.length) {
      return res.status(404).json({ message: 'Telefone não encontrado.' });
    }

    res.json(foundClients.map(formatResult));
  } catch (err) {
    next(err);
  }
};
