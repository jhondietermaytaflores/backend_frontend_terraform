import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'

function InventarioSector() {
    const [inventario, setInventario] = useState([])
    const [asignados, setAsignados] = useState([])
    const [filtroSector, setFiltroSector] = useState('')
    const [form, setForm] = useState({
        nombre_sector: '',
        inventario_id: '',
        cantidad: 1,
        observacion: ''
    })

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        const [inv, asignados] = await Promise.all([
            api.get('/inventario'),
            api.get('/inventario-sector')
        ])
        setInventario(inv.data)
        setAsignados(asignados.data)
    }

    const guardar = async (e) => {
        e.preventDefault()
        const { nombre_sector, inventario_id, cantidad } = form

        if (!nombre_sector || !inventario_id || cantidad <= 0) {
            return Swal.fire("Campos incompletos", "Completa todos los datos", "warning")
        }

        try {
            await api.post('/inventario-sector', form)
            Swal.fire("Asignado", "Ítem asignado al sector", "success")
            setForm({ nombre_sector: '', inventario_id: '', cantidad: 1, observacion: '' })
            cargarDatos()
        } catch (err) {
            Swal.fire("Error", "No se pudo asignar", "error")
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
            await api.delete(`/inventario-sector/${id}`)
            Swal.fire("Eliminado", "", "success")
            cargarDatos()
        }
    }

    const sectoresUnicos = [...new Set(asignados.map(a => a.nombre_sector))]

    const asignadosFiltrados = filtroSector
        ? asignados.filter(a => a.nombre_sector === filtroSector)
        : asignados

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Inventario por Sector</h2>

            {/* Filtro */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <select
                    className="border p-2 rounded w-full md:w-1/3"
                    value={filtroSector}
                    onChange={(e) => setFiltroSector(e.target.value)}
                >
                    <option value="">Todos los sectores</option>
                    {sectoresUnicos.map((sector, idx) => (
                        <option key={idx} value={sector}>
                            {sector}
                        </option>
                    ))}
                </select>
                <button
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={() => setFiltroSector('')}
                >
                    Limpiar Filtro
                </button>
            </div>

            {/* Formulario */}
            <form
                onSubmit={guardar}
                className="bg-white shadow p-6 rounded grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <input
                    type="text"
                    placeholder="Nombre del sector (ej: Cocina)"
                    value={form.nombre_sector}
                    onChange={(e) => setForm({ ...form, nombre_sector: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <select
                    value={form.inventario_id}
                    onChange={(e) => setForm({ ...form, inventario_id: e.target.value })}
                    className="border p-2 rounded"
                    required
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
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                    className="border p-2 rounded"
                    placeholder="Cantidad"
                    min={1}
                />

                <input
                    type="text"
                    value={form.observacion}
                    onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                    className="border p-2 rounded"
                    placeholder="Observación (opcional)"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-4"
                >
                    Asignar al sector
                </button>
            </form>

            {/* Tabla */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 text-left">Sector</th>
                            <th className="p-2 text-left">Ítem</th>
                            <th className="p-2 text-left">Cantidad</th>
                            <th className="p-2 text-left">Observación</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignadosFiltrados.map((a) => (
                            <tr key={a.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{a.nombre_sector}</td>
                                <td className="p-2">{a.inventario?.nombre}</td>
                                <td className="p-2">{a.cantidad}</td>
                                <td className="p-2">{a.observacion}</td>
                                <td className="p-2">
                                    <button
                                        className="text-red-500 hover:underline text-sm"
                                        onClick={() => eliminar(a.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {asignadosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">Sin asignaciones</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InventarioSector
