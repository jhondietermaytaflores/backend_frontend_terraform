import express from 'express'
import {
  obtenerAsignaciones,
  obtenerAsignacion_porID,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from '../controllers/asignacionesController.js'

const router = express.Router()

router.get('/', obtenerAsignaciones)
router.get('/:id', obtenerAsignacion_porID)
router.post('/', crearAsignacion)
router.put('/:id', actualizarAsignacion)
router.delete('/:id', eliminarAsignacion)

export default router
