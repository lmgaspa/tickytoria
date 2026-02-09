import { Router } from 'express'
import { login, register, deleteUser } from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/isAdmin'
import { getProfile, updateProfile } from '../controllers/profile.controller'
import {
  forgotPassword,
  resetPassword
} from '../controllers/password.controller'

import { registerCompany } from '../controllers/company.controller'

const router = Router()

// Rotas públicas
router.post('/login', login)
router.post('/register-company', registerCompany)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Rotas protegidas
router.post('/register', verifyToken, register)
router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)
router.delete('/delete/:email', verifyToken, deleteUser)

export default router
