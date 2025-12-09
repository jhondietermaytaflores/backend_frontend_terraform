import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'
import { FaUserEdit, FaTrash, FaUserPlus, FaEye } from 'react-icons/fa'
import ModalCliente from '../../componentes/clientes/ModalCliente'
import ModalHistorialCliente from '../../componentes/clientes/ModalHistorialCliente'


function UsuariosClientesAdmin() {
    const [clientes, setClientes] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [clienteEdit, setClienteEdit] = useState(null)

    const [showHistorial, setShowHistorial] = useState(false)
    const [clienteHistorial, setClienteHistorial] = useState(null)
    const [historial, setHistorial] = useState(null)

    

    const cargarClientes = async () => {
        const { data } = await api.get('/clientes')
        setClientes(data)
    }

    const eliminar = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar cliente?',
            icon: 'warning',
            showCancelButton: true,
        })
        if (confirm.isConfirmed) {
            await api.delete(`/clientes/${id}`)
            cargarClientes()
            Swal.fire('Eliminado', '', 'success')
        }
    }

    const guardar = async (cliente) => {
        if (clienteEdit) {
            await api.put(`/clientes/${clienteEdit.id_cliente}`, cliente)
            Swal.fire('Actualizado', '', 'success')
        } else {
            await api.post('/clientes', cliente)
            Swal.fire('Creado', 'Cliente y usuario registrado correctamente', 'success')
        }
        setShowModal(false)
        cargarClientes()
    }

    const verHistorial = async (cliente) => {
        try {
            const { data } = await api.get(`/clientes/${cliente.id_cliente}/historial`)
            setClienteHistorial(cliente)
            setHistorial(data)
            setShowHistorial(true)
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'No se pudo cargar el historial del cliente', 'error')
        }
    }

    useEffect(() => {
        cargarClientes()
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Clientes registrados</h2>
                <button onClick={() => {
                    setClienteEdit(null)
                    setShowModal(true)
                }} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <FaUserPlus /> Nuevo cliente
                </button>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>CI</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id_cliente} className="border-t text-center">
                                <td className="p-2">{c.nombres} {c.apellidos}</td>
                                <td>{c.correo}</td>
                                <td>{c.telefono}</td>
                                <td>{c.ci}</td>
                                <td className="flex justify-center gap-3 py-2">
                                    <button onClick={() => {
                                        setClienteEdit(c)
                                        setShowModal(true)
                                    }} className="text-blue-600" title='Editar Cliente'><FaUserEdit /></button>
                                    <button onClick={() => eliminar(c.id_cliente)} className="text-red-600" title="Eliminar cliente" ><FaTrash /></button>
                                    <button onClick={() => verHistorial(c)} className="text-gray-700"  title="Ver historial" ><FaEye />
                                    
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalCliente
                visible={showModal}
                clienteEdit={clienteEdit}
                onClose={() => setShowModal(false)}
                onSubmit={guardar}
            />

            <ModalHistorialCliente
                visible={showHistorial}
                cliente={clienteHistorial}
                historial={historial}
                onClose={() => setShowHistorial(false)}
            />
        </div>
    )
}

export default UsuariosClientesAdmin
