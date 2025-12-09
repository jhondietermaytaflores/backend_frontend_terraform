import express from 'express'
import {
  obtenerTiposTarea,
  obtenerTipoTarea,
  crearTipoTarea,
  actualizarTipoTarea,
  eliminarTipoTarea
} from '../controllers/tiposTareaController.js'

const router = express.Router()

router.get('/', obtenerTiposTarea)
router.get('/:id', obtenerTipoTarea)
router.post('/', crearTipoTarea)
router.put('/:id', actualizarTipoTarea)
router.delete('/:id', eliminarTipoTarea)

export default router
