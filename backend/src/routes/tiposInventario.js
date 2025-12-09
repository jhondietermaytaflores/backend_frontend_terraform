import express from 'express'
import {
  listarTiposInventario,
  crearTipoInventario,
  eliminarTipoInventario,
} from '../controllers/tiposInventarioController.js'

const router = express.Router()

router.get('/', listarTiposInventario)
router.post('/', crearTipoInventario)
router.delete('/:id', eliminarTipoInventario)

export default router
