import express from 'express'
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto, obtenerProductoPorId } from '../controllers/productosController.js'
import multer from 'multer'
import { subirImagen } from '../controllers/productosController.js'

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('imagen'), subirImagen)

router.get('/', listarProductos)
router.post('/', crearProducto)

router.put('/:id', actualizarProducto)
router.delete('/:id', eliminarProducto)

router.get('/:id', obtenerProductoPorId)

export default router
