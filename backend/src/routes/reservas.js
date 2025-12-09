import express from 'express'
import { crearReserva,listarReservas ,obtenerReservaPorId ,actualizarReserva ,eliminarReserva , actualizarEstado ,obtenerReservasPorCliente , crearReserva_deCliente} from '../controllers/reservasController.js'

import { authMiddleware } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.post('/', crearReserva)
router.get('/', listarReservas)

router.put('/:id', actualizarEstado)

router.post('/',authMiddleware, crearReserva_deCliente) // <-- ruta para cliente
//router.get('/cliente/:id',authMiddleware, obtenerReservasPorCliente) // <-- ruta para cliente
router.get('/cliente',authMiddleware, obtenerReservasPorCliente) // <-- ruta para cliente
router.put('/:id/estado', actualizarEstado)
router.get('/:id', obtenerReservaPorId)
router.put('/:id', actualizarReserva)
router.delete('/:id', eliminarReserva)

export default router
