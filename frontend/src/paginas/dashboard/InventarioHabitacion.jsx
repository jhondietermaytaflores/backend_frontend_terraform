import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'

function InventarioHabitacion() {
    const [habitaciones, setHabitaciones] = useState([])
    const [inventario, setInventario] = useState([])
    const [asignados, setAsignados] = useState([])
    const [filtroHabitacion, setFiltroHabitacion] = useState('')
    const [form, setForm] = useState({
        habitacion_id: '',
        inventario_id: '',
        cantidad: 1,
        estado: 'en uso',
    })

    useEffect(() => {
        cargarTodo()
    }, [])

    const cargarTodo = async () => {
        const [habs, inv, asignados] = await Promise.all([
            api.get('/habitaciones'),
            api.get('/inventario'),
            api.get('/inventario-habitacion')
        ])
        setHabitaciones(habs.data)
        setInventario(inv.data)
        setAsignados(asignados.data)
    }

    const asignarItem = async (e) => {
        e.preventDefault()

        if (!form.habitacion_id || !form.inventario_id || form.cantidad <= 0) {
            return Swal.fire("Campo inválido", "Coloca un valor correcto (que no sea 0 o menos) _o no se selecciono alguno de los selects", "warning")
        }


        try {
            await api.post('/inventario-habitacion', form)
            Swal.fire('Asignado', 'Ítem asignado a habitación', 'success')
            setForm({ habitacion_id: '', inventario_id: '', cantidad: 1, estado: 'en uso' })
            cargarTodo()
        } catch (err) {
            Swal.fire('Error', 'No se pudo asignar el ítem', 'error')
        }
    }

    const eliminar = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar ítem asignado?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
        })
        if (confirm.isConfirmed) {
            await api.delete(`/inventario-habitacion/${id}`)
            Swal.fire('Eliminado', '', 'success')
            cargarTodo()
        }
    }

    const asignadosFiltrados = filtroHabitacion
        ? asignados.filter(r => r.habitacion_id === parseInt(filtroHabitacion))
        : asignados

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Inventario asignado por Habitación</h2>

            {/* Filtro por habitación */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <select
                    className="border p-2 rounded w-full md:w-1/3"
                    value={filtroHabitacion}
                    onChange={(e) => setFiltroHabitacion(e.target.value)}
                >
                    <option value="">Todas las habitaciones</option>
                    {habitaciones.map(h => (
                        <option key={h.id_habitacion} value={h.id_habitacion}>
                            Habitación {h.numero}
                        </option>
                    ))}
                </select>
                <button
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={() => setFiltroHabitacion('')}
                >
                    Limpiar Filtro
                </button>
            </div>

            {/* Formulario de asignación */}
            <form
                onSubmit={asignarItem}
                className="bg-white shadow p-6 rounded grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <select
                    required
                    name="habitacion_id"
                    value={form.habitacion_id}
                    onChange={(e) => setForm({ ...form, habitacion_id: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">Seleccionar habitación</option>
                    {habitaciones.map(h => (
                        <option key={h.id_habitacion} value={h.id_habitacion}>
                            {h.numero}
                        </option>
                    ))}
                </select>

                <select
                    required
                    name="inventario_id"
                    value={form.inventario_id}
                    onChange={(e) => setForm({ ...form, inventario_id: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">Seleccionar ítem</option>
                    {inventario.map(i => (
                        <option key={i.id_inventario} value={i.id_inventario}>
                            {i.nombre}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="cantidad"
                    min={1}
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                    className="border p-2 rounded"
                    placeholder="Cantidad"
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Asignar
                </button>
            </form>

            {/* Tabla de asignaciones */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 text-left">Habitación</th>
                            <th className="p-2 text-left">Ítem</th>
                            <th className="p-2 text-left">Cantidad</th>
                            <th className="p-2 text-left">Estado</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignadosFiltrados.map((r) => (
                            <tr key={r.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{r.habitaciones?.numero || '-'}</td>
                                <td className="p-2">{r.inventario?.nombre || '-'}</td>
                                <td className="p-2">{r.cantidad}</td>
                                <td className="p-2">{r.estado}</td>
                                <td className="p-2">
                                    <button
                                        className="text-red-500 hover:underline text-sm"
                                        onClick={() => eliminar(r.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {asignadosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">No hay registros</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InventarioHabitacion
