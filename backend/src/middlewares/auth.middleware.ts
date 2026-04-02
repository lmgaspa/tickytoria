import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';

// Estende o Request para tipar corretamente o `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: jwt.JwtPayload & { dbUser?: any }; // Adiciona o usuário do banco
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token ausente ou mal formatado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verificar se o token JWT é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { id: string };

    // 2. Verificar se o usuário ainda existe no banco de dados
    const dbUser = await User.findById(decoded.id).select('-password'); // Não incluir senha

    if (!dbUser) {
      res.status(401).json({ message: 'Usuário não encontrado ou conta desativada' });
      return;
    }

    // 3. Verificar se as informações do token ainda são válidas
    if (dbUser.companyId !== decoded.companyId || dbUser.role !== decoded.role) {
      res.status(401).json({ message: 'Token inválido - permissões alteradas' });
      return;
    }

    // 4. Anexar tanto o payload do JWT quanto o usuário do banco
    req.user = {
      ...decoded,
      dbUser: dbUser // Usuário completo do banco para uso posterior
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token inválido' });
    } else if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expirado' });
    } else {
      res.status(500).json({ message: 'Erro interno na autenticação' });
    }
  }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user?.dbUser; // Usar o usuário do banco, não do JWT
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado: Requer privilégios de administrador.' });
  }
};

export const verifyCompanyAccess = (req: Request, res: Response, next: NextFunction): void => {
  const tokenUser = req.user;
  const dbUser = req.user?.dbUser;

  if (!tokenUser || !dbUser) {
    res.status(401).json({ message: 'Autenticação requerida' });
    return;
  }

  // Verificar se o usuário ainda pertence à mesma empresa
  if (tokenUser.companyId !== dbUser.companyId) {
    res.status(403).json({ message: 'Acesso negado: Empresa alterada' });
    return;
  }

  next();
};
