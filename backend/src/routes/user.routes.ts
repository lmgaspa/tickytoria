import { Router } from 'express';
import {
  getAllUsers,
  getUserByName,
  getUserByEmail,
  getUserByWhatsapp,
  getUserByRole
} from '../controllers/user.search.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/all', verifyToken, getAllUsers);
router.get('/name/:name', verifyToken, getUserByName);
router.get('/email/:email', verifyToken, getUserByEmail);
router.get('/whatsapp/:whatsapp', verifyToken, getUserByWhatsapp);
router.get('/role/:role', verifyToken, getUserByRole);

export default router;
