import { useEffect, useState } from 'react'
import axios from 'axios'
//import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../../hooks/useAuth'


export default function InicioCliente() {
    const { usuario, token } = useAuth()
    const [habitaciones, setHabitaciones] = useState([])
    const [reservas, setReservas] = useState([])

    // Para el formulario de reserva:
    const [fechaEntrada, setFechaEntrada] = useState('')
    const [fechaSalida, setFechaSalida] = useState('')
    const [observaciones, setObservaciones] = useState('')
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null)

    /* const navigate = useNavigate()
    const location = useLocation() */

    // Leer query param ?habitacion=ID
    /* useEffect(() => {
        const params = new URLSearchParams(location.search)
        const habId = params.get('habitacion')
        if (habId) {
            setHabitacionSeleccionada(habId)
        }
    }, [location.search])
 */
    // Fetch de reservas y de habitaciones disponibles
    const fetchDatos = async () => {
        if (!usuario) return
        try {
            // 1) Reservas del cliente
            /* const resReservas = await axios.get(
                `http://localhost:3000/api/reservas/cliente/${usuario.id}`,
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            ) */
            const resReservas = await axios.get(
                'http://localhost:3000/api/reservas/cliente',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setReservas(resReservas.data)
        } catch (err) {
            console.error('Error cargando reservas del cliente:', err)
            Swal.fire('Error', 'No se pudieron cargar tus reservas', 'error')
        }
        try {
            // 2) Habitaciones disponibles
            const resHabitaciones = await axios.get(
                'http://localhost:3000/api/habitaciones/disponibles',
                //{ headers: token ? { Authorization: `Bearer ${token}` } : {} }
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setHabitaciones(resHabitaciones.data)
        } catch (err) {
            console.error('Error cargando habitaciones disponibles:', err)
            Swal.fire('Error', 'No se pudieron cargar habitaciones disponibles', 'error')
        }
    }

    useEffect(() => {
        fetchDatos()
    }, [usuario, token])

    // Maneja click en “Reservar” de una tarjeta de habitación: preselecciona y muestra formulario
    const handleReservarClick = (h) => {
        setHabitacionSeleccionada(h.id_habitacion)
        // opcional: limpiar fechas anteriores
        setFechaEntrada('')
        setFechaSalida('')
        setObservaciones('')
    }

    // Enviar el formulario de reserva
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!usuario || !token) {
            Swal.fire('Error', 'No estás autenticado', 'error')
            return
        }
        if (!habitacionSeleccionada || !fechaEntrada || !fechaSalida) {
            Swal.fire('Error', 'Completa todos los campos', 'warning')
            return
        }
        try {
            const body = {
                //cliente_id: usuario.id,
                //cliente_id: usuario.id_cliente, 
                habitacion_id: parseInt(habitacionSeleccionada),
                fecha_entrada: fechaEntrada,
                fecha_salida: fechaSalida,
                observaciones
            }
            await axios.post('http://localhost:3000/api/reservas',
                body, 
                //{headers: token ? { Authorization: `Bearer ${token}` } : {}}
                { headers: { Authorization: `Bearer ${token}` } }
            )
            Swal.fire('Éxito', 'Reserva creada correctamente', 'success')
            // Después de reservar: recargar datos y limpiar selección
            setHabitacionSeleccionada(null)
            setFechaEntrada('')
            setFechaSalida('')
            setObservaciones('')
            fetchDatos()
            // opción: redirigir o scroll a sección de “Tus Reservas”
        } catch (err) {
            console.error('Error creando reserva:', err)
            const msg = err.response?.data?.error || 'Error al crear reserva'
            Swal.fire('Error', msg, 'error')
        }
    }

    // Cancelar formulario de reserva
    const handleCancelarReserva = () => {
        setHabitacionSeleccionada(null)
        setFechaEntrada('')
        setFechaSalida('')
        setObservaciones('')
    }


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">¡Hola {usuario?.nombre}!</h1>

            {/* Sección: Reservar */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Haz tu reserva</h2>

                {/* Si existe habitación preseleccionada, mostrar formulario; sino, mostrar lista de habitaciones */}
                {habitacionSeleccionada ? (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Reservar Habitación #{habitacionSeleccionada}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Fecha de Entrada</label>
                            <input
                                type="date"
                                value={fechaEntrada}
                                onChange={e => setFechaEntrada(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Fecha de Salida</label>
                            <input
                                type="date"
                                value={fechaSalida}
                                onChange={e => setFechaSalida(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Observaciones</label>
                            <textarea
                                value={observaciones}
                                onChange={e => setObservaciones(e.target.value)}
                                className="w-full border p-2 rounded"
                                rows="3"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded"
                            >
                                Confirmar Reserva
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelarReserva}
                                className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {habitaciones.map(h => (
                            <div key={h.id_habitacion} className="bg-white shadow p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold text-indigo-600">Habitación #{h.numero}</h3>
                                {/* Si tienes más datos de categoría/tipo, muéstralos: */}
                                {h.tipo && (
                                    <p className="text-sm text-gray-600 mb-2">Tipo: {h.tipo}</p>
                                )}
                                {!h.tipo && h.id_categoria && (
                                    <p className="text-sm text-gray-600 mb-2">Categoría: {h.id_categoria}</p>
                                )}
                                {h.precio != null && (
                                    <p className="text-sm text-gray-600">Precio: Bs{h.precio}/noche</p>
                                )}
                                <button
                                    onClick={() => handleReservarClick(h)}
                                    className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded"
                                >
                                    Reservar
                                </button>
                            </div>
                        ))}
                        {habitaciones.length === 0 && (
                            <p className="text-gray-500">No hay habitaciones disponibles.</p>
                        )}
                    </div>
                )}
            </section>

            {/* Sección: Mostrar historial de reservas */}
            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Tus Reservas</h2>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-200 text-gray-600 text-sm">
                            <tr>
                                <th className="py-2 px-4">Habitación</th>
                                <th className="py-2 px-4">Fecha Entrada</th>
                                <th className="py-2 px-4">Fecha Salida</th>
                                <th className="py-2 px-4">Estado</th>
                                <th className="py-2 px-4">Creado En</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.length > 0 ? reservas.map(r => (
                                <tr key={r.id_reserva} className="text-sm text-gray-700">
                                    <td className="py-2 px-4 text-center">
                                        #{r.habitacion?.numero || r.habitacion_id}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {new Date(r.fecha_entrada).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {new Date(r.fecha_salida).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${(r.estado === 'confirmada' || r.estado === 'reservado')
                                                    ? 'bg-green-200 text-green-800'
                                                    : 'bg-yellow-200 text-yellow-800'
                                                }`}
                                        >
                                            {r.estado}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {r.creado_en
                                            ? new Date(r.creado_en).toLocaleString()
                                            : '-'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">
                                        No tienes reservas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}


