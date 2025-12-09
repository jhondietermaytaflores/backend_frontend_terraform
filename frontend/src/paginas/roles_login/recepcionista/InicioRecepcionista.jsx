/* export default function InicioRecepcionista() {
    return <h2 className="p-4 text-xl">Bienvenido, Recepcionista</h2>
}
 */

import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function InicioRecepcionista() {
    const [reservas, setReservas] = useState([])
    const [habitaciones, setHabitaciones] = useState([])

    const cargarDatos = async () => {
        try {
            // Listar todas las reservas con datos de cliente y habitación
            const resReservas = await axios.get('http://localhost:3000/api/reservas')
            setReservas(resReservas.data)
            // Listar todas las habitaciones
            const resHabitaciones = await axios.get('http://localhost:3000/api/habitaciones/todas')
            setHabitaciones(resHabitaciones.data)
        } catch (err) {
            console.error('Error cargar datos recepcionista:', err)
            Swal.fire('Error', 'No se pudieron cargar reservas u habitaciones', 'error')
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:3000/api/reservas/${id}/estado`, { estado: nuevoEstado })
            Swal.fire('Actualizado', `Reserva ${nuevoEstado}`, 'success')
            cargarDatos()
        } catch (err) {
            console.error('Error cambiar estado:', err)
            Swal.fire('Error', 'No se pudo actualizar estado', 'error')
        }
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-indigo-700">Panel del Recepcionista</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Reservas</h2>
                <div className="overflow-auto rounded-lg shadow border">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-indigo-50 text-indigo-600">
                            <tr>
                                <th className="py-2 px-4">Cliente</th>
                                <th className="py-2 px-4">Habitación</th>
                                <th className="py-2 px-4">Inicio</th>
                                <th className="py-2 px-4">Fin</th>
                                <th className="py-2 px-4">Estado</th>
                                <th className="py-2 px-4">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(r => (
                                <tr key={r.id_reserva} className="border-t">
                                    {/* Usamos r.cliente o r.usuario según tu respuesta. En el controlador sugerido usamos r.usuario.nombre */}
                                    <td className="py-2 px-4">{r.usuario?.nombre || '—'}</td>
                                    <td className="py-2 px-4 text-center">#{r.habitacion?.numero || r.habitacion_id}</td>
                                    <td className="py-2 px-4 text-center">{new Date(r.fecha_entrada).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 text-center">{new Date(r.fecha_salida).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${r.estado === 'confirmada' || r.estado === 'reservado' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                            {r.estado}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center space-x-2">
                                        {r.estado !== 'confirmada' && (
                                            <button
                                                onClick={() => cambiarEstado(r.id_reserva, 'confirmada')}
                                                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                            >
                                                Confirmar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => cambiarEstado(r.id_reserva, 'cancelada')}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reservas.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">No hay reservas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Estado de Habitaciones</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {habitaciones.map(h => (
                        <div key={h.id_habitacion} className="bg-gray-100 p-4 rounded shadow">
                            <h3 className="text-lg font-bold text-indigo-700">#{h.numero}</h3>
                            <p className="text-sm">Tipo: {h.id_categoria}</p>
                            <p className="text-sm">Estado: <strong>{h.estado}</strong></p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}


