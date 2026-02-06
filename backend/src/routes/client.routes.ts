import { Router } from 'express';
import { createClient } from '../controllers/client.controller';
import { 
  getAllClients,
  getClientByName,
  getClientByCpf,
  getClientByCnpj,
  getClientByEmail,
  getClientByEmpresa,
  getClientByWhatsapp,
  getClientByTelefone
} from '../controllers/client.search.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, createClient);

// Rotas de Busca
router.get('/all', verifyToken, getAllClients);
router.get('/name/:name', verifyToken, getClientByName);
router.get('/cpf/:cpf', verifyToken, getClientByCpf);
router.get('/cnpj/:cnpj', verifyToken, getClientByCnpj);
router.get('/email/:email', verifyToken, getClientByEmail);
router.get('/empresa/:empresa', verifyToken, getClientByEmpresa);
router.get('/whatsapp/:whatsapp', verifyToken, getClientByWhatsapp);
router.get('/telefone/:telefone', verifyToken, getClientByTelefone);

export default router;
