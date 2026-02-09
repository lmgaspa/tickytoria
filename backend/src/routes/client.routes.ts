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
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, verifyAdmin, createClient);

// Rotas de Busca
router.get('/all', verifyToken, verifyAdmin, getAllClients);
router.get('/name/:name', verifyToken, verifyAdmin, getClientByName);
router.get('/cpf/:cpf', verifyToken, verifyAdmin, getClientByCpf);
router.get('/cnpj/:cnpj', verifyToken, verifyAdmin, getClientByCnpj);
router.get('/email/:email', verifyToken, verifyAdmin, getClientByEmail);
router.get('/empresa/:empresa', verifyToken, verifyAdmin, getClientByEmpresa);
router.get('/whatsapp/:whatsapp', verifyToken, verifyAdmin, getClientByWhatsapp);
router.get('/telefone/:telefone', verifyToken, verifyAdmin, getClientByTelefone);

export default router;
