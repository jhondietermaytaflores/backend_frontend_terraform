import express from 'express'
/* import { crearPedido, listarPedidos, actualizarEstado } from '../controllers/pedidosController.js' */

import { crearPedido, listarPedidos   , obtenerPedidoPorId , eliminarPedido, actualizarPedido
, actualizarEstadoPedido} from '../controllers/pedidosController.js'

const router = express.Router()

router.post('/', crearPedido)
router.get('/', listarPedidos)

router.put('/:id', actualizarEstadoPedido)


//crud
router.get('/:id', obtenerPedidoPorId)
router.put('/:id', actualizarPedido)
router.delete('/:id', eliminarPedido)

export default router





/* const router = express.Router()

router.post('/', crearPedido)
router.get('/', listarPedidos)
router.patch('/:id', actualizarEstado)

export default router */
