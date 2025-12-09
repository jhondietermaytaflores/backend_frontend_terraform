import express from 'express'
import {
  listarInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
} from '../controllers/inventarioController.js'

const router = express.Router()

router.get('/', listarInventario)
router.post('/', crearInventario)
router.put('/:id', actualizarInventario)
router.delete('/:id', eliminarInventario)

export default router
