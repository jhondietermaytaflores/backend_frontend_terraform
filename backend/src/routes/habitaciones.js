import express from 'express'
/* import { crearHabitacion, asignarHabitacion, listarDisponibles } from '../controllers/habitacionController.js' */


import { obtenerTodas, crear, actualizar, eliminar , obtenerHabitacionesDisponibles ,listarHabitaciones ,obtenerCategoriasHabitacion ,obtenerPisos, listarHabitacionesDisponibles } from '../controllers/habitacionesController.js'

const router = express.Router()

router.get('/', listarHabitaciones)
router.get('/disponibles', listarHabitacionesDisponibles)

router.get('/todas', obtenerTodas)
router.post('/', crear)
router.put('/:id', actualizar)
router.delete('/:id', eliminar)

router.get('/disponibles', obtenerHabitacionesDisponibles)
router.get('/pisos', obtenerPisos)
router.get('/categorias', obtenerCategoriasHabitacion)

export default router




/* const router = express.Router()

router.post('/', crearHabitacion)
router.get('/disponibles', listarDisponibles)
router.post('/asignar', asignarHabitacion)

export default router */
