import express from 'express'
import { listarUsuarios,
        crearUsuario,
        actualizarUsuario,obtenerUsuarioPorId,
        eliminarUsuario, guardarDescriptor ,getUsuariosConDescriptor
        ,obtenerEmpleados 
 } from '../controllers/usuariosController.js'



const router = express.Router()
router.get('/', listarUsuarios)


//crud
router.post('/', crearUsuario)
router.put('/:id', actualizarUsuario)

router.get('/empleados', obtenerEmpleados)
router.get('/:id', obtenerUsuarioPorId)
router.delete('/:id', eliminarUsuario)

router.post('/:id/descriptor', guardarDescriptor)

router.get('/con-descriptor', getUsuariosConDescriptor)



export default router
