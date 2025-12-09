import express from 'express'
import {
  listarPorHabitacion,
  crearInventarioHabitacion,
  eliminarInventarioHabitacion,
} from '../controllers/inventarioHabitacionController.js'

const router = express.Router()

router.get('/', listarPorHabitacion)
router.post('/', crearInventarioHabitacion)
router.delete('/:id', eliminarInventarioHabitacion)

export default router
