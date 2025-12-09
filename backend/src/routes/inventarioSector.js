import express from 'express'
import {
  listarPorSector,
  crearInventarioSector,
  eliminarInventarioSector,
} from '../controllers/inventarioSectorController.js'

const router = express.Router()

router.get('/', listarPorSector)
router.post('/', crearInventarioSector)
router.delete('/:id', eliminarInventarioSector)

export default router
