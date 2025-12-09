import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'
import ModalUsuario from '../../componentes/ModalUsuario'
import { FaUserEdit, FaTrash, FaUserPlus, FaCamera } from 'react-icons/fa'
import FaceRegistrationDescriptors from '../empleados/FaceRegistrationDescriptors'



function UsuariosEmpleadosAdmin() {
    const [usuarios, setUsuarios] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState(null)


    // Para controlar la ventana de registro de rostros:
    const [showFaceReg, setShowFaceReg] = useState(false)
    const [usuarioParaFace, setUsuarioParaFace] = useState(null)

    const cargarUsuarios = async () => {
        const { data } = await api.get('/usuarios')
        const empleados = data.filter(u => u.id_rol !== 3) 
        setUsuarios(empleados)
    }

    const guardarUsuario = async (datos) => {
        if (usuarioEditando) {
            await api.put(`/usuarios/${usuarioEditando.id}`, datos)
            Swal.fire('Actualizado', 'Empleado actualizado', 'success')
        } else {
            await api.post('/usuarios', datos)
            Swal.fire('Creado', 'Empleado registrado', 'success')
        }
        setShowModal(false)
        cargarUsuarios()
    }

    const eliminarUsuario = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar empleado?',
            icon: 'warning',
            showCancelButton: true,
        })
        if (confirm.isConfirmed) {
            await api.delete(`/usuarios/${id}`)
            cargarUsuarios()
            Swal.fire('Eliminado', '', 'success')
        }
    }

    useEffect(() => {
        cargarUsuarios()
    }, [])

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Empleados</h2>
                <button onClick={() => { setShowModal(true); setUsuarioEditando(null) }} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <FaUserPlus /> Nuevo
                </button>
            </div>
            <div className="overflow-x-auto bg-white shadow rounded">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Nombre</th>
                            <th className='text-left'>Correo</th>
                            <th className='text-left' >Teléfono</th>
                            <th className='text-left'>Rol</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id} className="border-t">
                                <td className="p-2">{u.nombre}</td>
                                <td>{u.correo}</td>
                                <td>{u.telefono}</td>
                                <td>{u.roles?.nombre_rol || '—'}</td>
                                <td className="text-center">
                                    <button onClick={() => { setShowModal(true); setUsuarioEditando(u) }} className="text-blue-600 mx-1" title='Editar usuario'><FaUserEdit /></button>
                                    <button onClick={() => eliminarUsuario(u.id)} className="text-red-600 mx-1" title="Eliminar usuario"><FaTrash /></button>
                                    <button
                                        onClick={() => {setUsuarioParaFace(u)
                                            setShowFaceReg(true) }}className="text-green-600 mx-1" title="Registrar datos faciales"><FaCamera />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <ModalUsuario
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={guardarUsuario}
                    userEdit={usuarioEditando}
                    soloRoles={['administrador', 'recepcionista', 'camarero', 'cocinero', 'limpieza']} // filtramos roles
                />
            )}
            {showFaceReg && usuarioParaFace && (
                <FaceRegistrationDescriptors
                    usuario={usuarioParaFace}
                    onClose={() => {
                        setShowFaceReg(false)
                        setUsuarioParaFace(null)
                    }}
                />
            )}
        </div>
    )
}

export default UsuariosEmpleadosAdmin
