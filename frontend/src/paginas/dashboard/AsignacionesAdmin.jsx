import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function AsignacionesAdmin() {
    const [usuarios, setUsuarios] = useState([])
    const [tiposTarea, setTiposTarea] = useState([])
    const [asignaciones, setAsignaciones] = useState([])

    const [usuarioId, setUsuarioId] = useState("")
    const [tareaId, setTareaId] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [idAsignacionEditando, setIdAsignacionEditando] = useState(null)
    const [busqueda, setBusqueda] = useState("")

    const [habitaciones, setHabitaciones] = useState([])
    const [habitacionId, setHabitacionId] = useState("")

    const [estadoAsignacion, setEstadoAsignacion] = useState("pendiente")


    const obtenerDatos = async () => {
        const [resUsuarios, resTareas, resAsignaciones, resHabitaciones] = await Promise.all([
            axios.get('http://localhost:3000/api/usuarios/empleados'),
            axios.get('http://localhost:3000/api/tipos_tarea'),
            axios.get('http://localhost:3000/api/asignaciones'),
            axios.get('http://localhost:3000/api/habitaciones/todas') // <-- nuevo
        ])
        //const empleados = resUsuarios.data.filter(usuario => usuario.id_rol !== 3)
        setUsuarios(resUsuarios.data)
        setTiposTarea(resTareas.data)
        setAsignaciones(resAsignaciones.data)
        setHabitaciones(resHabitaciones.data) // <-- nuevo
    }

    useEffect(() => {
        obtenerDatos()
    }, [])

    const guardarAsignacion = async () => {
        try {
            if (idAsignacionEditando) {
                await axios.put(`http://localhost:3000/api/asignaciones/${idAsignacionEditando}`, {
                    usuario_id: usuarioId,
                    tarea_id: tareaId,
                    habitacion_id: habitacionId, // nuevo
                    descripcion,
                    estado: estadoAsignacion, // usa este estado aquí
                })
                Swal.fire('Actualizado', 'Asignación actualizada', 'success')
            } else {
                await axios.post('http://localhost:3000/api/asignaciones', {
                    usuario_id: usuarioId,
                    tarea_id: tareaId,
                    habitacion_id: habitacionId, // nuevo
                    descripcion,
                    estado: "pendiente",
                    fecha_asignacion: new Date().toISOString()
                })
                Swal.fire('Éxito', 'Tarea asignada', 'success')
            }

            // Reset
            setUsuarioId("")
            setTareaId("")
            setHabitacionId("") // 🔧 NUEVO
            setDescripcion("")
            setEstadoAsignacion("Pendiente") // Reiniciar
            setIdAsignacionEditando(null)
            obtenerDatos()

        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar la asignación', 'error')
        }
    }

    const asignacionesFiltradas = asignaciones.filter(a =>
    (a.usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.tipo_tarea?.nombre_tarea?.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(busqueda.toLowerCase()))
    )

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Asignación de Tareas</h2>
            <h3 className="text-lg mb-2">Buscar Asignaciones</h3>
            <input
                type="text"
                placeholder="Buscar por usuario, tarea o descripción"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="border px-4 py-2 mb-4 w-full light:bg-white light:text-black dark:text-white dark:bg-[#1e293b] dark:border-gray-700 rounded"
            />
            <h3 className="text-lg mb-2">Nueva Asignación</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} className="border p-2 text-white dark:bg-blue-950">
                    <option value="">Seleccione Usuario</option>
                    {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre}</option>
                    ))}
                </select>

                <select value={tareaId} onChange={e => setTareaId(e.target.value)} className="border p-2 dark:text-white dark:bg-blue-950">
                    <option value="">Seleccione Tipo de Tarea</option>
                    {tiposTarea.map(t => (
                        <option key={t.id_tarea} value={t.id_tarea}>{t.nombre_tarea}</option>
                    ))}
                </select>

                {/* 🔧 Habitación */}
                <select width="10px" value={habitacionId} onChange={e => setHabitacionId(e.target.value)} className="border p-2 dark:text-white dark:bg-blue-950">
                    <option value="">a N° Hab</option>
                    {habitaciones.map(h => (
                        <option key={h.id_habitacion} value={h.id_habitacion}>
                            Habitación {h.numero || h.id_habitacion}
                        </option>
                    ))}
                </select>

                {usuarioId && (
                    <div className="text-sm text-gray-600">
                        Rol del empleado: {
                            <strong>{usuarios.find(u => u.id === parseInt(usuarioId))?.rol?.nombre_rol || 'Desconocido'}</strong>}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Descripción"
                    className="border p-2 border-slate-950"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />

                {idAsignacionEditando && (
                    <select
                        value={estadoAsignacion}
                        onChange={e => setEstadoAsignacion(e.target.value)}
                        className="border p-2 mb-2 dark:text-white dark:bg-blue-950"
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="en progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                )}


            </div>

            <button onClick={guardarAsignacion} className="bg-green-600 text-white px-4 py-2 rounded">
                {idAsignacionEditando ? 'Actualizar' : 'Asignar'}
            </button>
            <table className="min-w-full mt-6 border dark:bg-blue-950">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <th className="p-2 border">Usuario</th>
                        <th className="p-2 border">Tarea</th>
                        <th className="p-2 border">Habitación</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Estado</th>
                        <th className="p-2 border">Fecha Asignada</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {asignacionesFiltradas.map(a => (
                        <tr key={a.id_asignacion}>
                            <td className="p-2 border dark:text-white">{a.usuario?.nombre || a.usuario_id}</td>
                            <td className="p-2 border dark:text-white">{a.tipo_tarea?.nombre_tarea || a.tarea_id}</td>
                            <td className="p-2 border dark:text-white">{a.habitacion?.numero || a.habitacion_id}</td>
                            <td className="p-2 border dark:text-white">{a.descripcion}</td>
                            <td className="p-2 border dark:text-white">{a.estado}</td>
                            <td className="p-2 border dark:text-white">{new Date(a.fecha_asignacion).toLocaleString()}</td>
                            <td className="p-2  border flex-col  gap-2">
                                <button
                                    onClick={() => {
                                        setUsuarioId(a.usuario_id)
                                        setTareaId(a.tarea_id)
                                        setHabitacionId(a.habitacion_id || "")
                                        setDescripcion(a.descripcion)
                                        setEstadoAsignacion(a.estado) // aea
                                        setIdAsignacionEditando(a.id_asignacion)
                                    }}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded">Editar
                                </button>

                                <button
                                    onClick={async () => {
                                        if (confirm('¿Seguro de eliminar esta asignación?')) {
                                            await axios.delete(`http://localhost:3000/api/asignaciones/${a.id_asignacion}`)
                                            Swal.fire('Éxito', 'Asignación eliminada', 'success')
                                            obtenerDatos()
                                        }
                                    }}
                                    className="bg-red-500 text-white px-2 py-1 rounded"> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
