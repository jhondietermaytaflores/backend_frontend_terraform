import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'
import ModalUsuario from '../../componentes/ModalUsuario'
import { FaUserEdit, FaTrash, FaUserPlus } from 'react-icons/fa'

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)

  const cargarUsuarios = async () => {
    const { data } = await api.get('/usuarios')
    setUsuarios(data)
  }

  const handleCrear = () => {
    setUsuarioEditando(null)
    setShowModal(true)
  }

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario)
    setShowModal(true)
  }

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    })

    if (confirm.isConfirmed) {
      await api.delete(`/usuarios/${id}`)
      Swal.fire('Eliminado', '', 'success')
      cargarUsuarios()
    }
  }

  const guardarUsuario = async (datos) => {
    if (usuarioEditando) {
      await api.put(`/usuarios/${usuarioEditando.id}`, datos)
      Swal.fire('Actualizado', 'El usuario fue actualizado', 'success')
    } else {
      await api.post('/usuarios', datos)
      Swal.fire('Creado', 'Usuario registrado correctamente', 'success')
    }
    setShowModal(false)
    cargarUsuarios()
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de usuarios</h2>
        <button onClick={handleCrear} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaUserPlus /> Nuevo usuario
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.telefono}</td>
                <td>{u.roles?.nombre_rol || '—'}</td>
                <td className="text-center space-x-2">
                  <button onClick={() => handleEditar(u)} className="text-blue-600 hover:text-blue-800">
                    <FaUserEdit />
                  </button>
                  <button onClick={() => handleEliminar(u.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalUsuario
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={guardarUsuario}
        userEdit={usuarioEditando}
      />
    </div>
  )
}

export default UsuariosAdmin
