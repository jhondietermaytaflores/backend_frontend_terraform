import express from 'express'
import { login, registrar ,loginFacial } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/registro', registrar)



router.post('/login-facial', loginFacial)

export default router

/* router.post('/login', (req, res) => {
  console.log('Ruta de login alcanzada');  // Esto debería aparecer en la consola del servidor
  login(req, res);
}); */
