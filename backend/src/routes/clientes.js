import express from 'express'
import { crearCliente, actualizarCliente, obtenerClientePorId, eliminarCliente,listarClientes ,buscarClientes
, obtenerHistorialCliente

, obtenerReservasPorCliente
} from '../controllers/clientesController.js'



const router = express.Router()
router.get('/buscar', buscarClientes) // <- Esta debe ir primero


router.get('/:id/historial', obtenerHistorialCliente)
router.get('/:id/reservas', obtenerReservasPorCliente)

router.get('/', listarClientes)

// CRUD
router.post('/', crearCliente)
router.put('/:id', actualizarCliente)
router.get('/:id', obtenerClientePorId)
router.delete('/:id', eliminarCliente)

export default router