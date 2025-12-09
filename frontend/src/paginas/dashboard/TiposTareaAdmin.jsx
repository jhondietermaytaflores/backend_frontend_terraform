// src/paginas/dashboard/TiposTareaAdmin.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function TiposTareaAdmin() {
    const [tareas, setTareas] = useState([])
    const [nombreTarea, setNombreTarea] = useState("")
    const [editandoId, setEditandoId] = useState(null)

    const obtenerTareas = async () => {
        const { data } = await axios.get('http://localhost:3000/api/tipos_tarea')
        setTareas(data)
    }

    useEffect(() => {
        obtenerTareas()
    }, [])

    const guardarTarea = async () => {
        try {
            if (editandoId) {
                await axios.put(`http://localhost:3000/api/tipos_tarea/${editandoId}`, { nombre_tarea: nombreTarea })
                Swal.fire('Actualizado', 'Tipo de tarea actualizado correctamente', 'success')
            } else {
                await axios.post('http://localhost:3000/api/tipos_tarea', { nombre_tarea: nombreTarea })
                Swal.fire('Registrado', 'Nuevo tipo de tarea registrado', 'success')
            }
            setNombreTarea("")
            setEditandoId(null)
            obtenerTareas()
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar', 'error')
        }
    }

    const eliminarTarea = async (id) => {
        if (!confirm('¿Seguro de eliminar este tipo de tarea?')) return
        await axios.delete(`http://localhost:3000/api/tipos_tarea/${id}`)
        obtenerTareas()
    }

    const cargarTarea = (tarea) => {
        setEditandoId(tarea.id_tarea)
        setNombreTarea(tarea.nombre_tarea)
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Tipos de Tarea</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Nombre de tarea"
                    className="border p-2 flex-1 dark:bg-[#2d3748] dark:text-white"
                    value={nombreTarea}
                    onChange={(e) => setNombreTarea(e.target.value)}
                />
                <button onClick={guardarTarea} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editandoId ? "Actualizar" : "Guardar"}
                </button>
            </div>

            <table className="min-w-full border ">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border dark:text-white dark:bg-[#1a202c]">ID</th>
                        <th className="p-2 border dark:text-white dark:bg-[#1a202c]">Nombre</th>
                        <th className="p-2 border dark:text-white dark:bg-[#1a202c]">Acciones</th>
                    </tr>
                </thead>
                <tbody className='dark:bg-[#2d3748] text-white'>
                    {tareas.map(t => (
                        <tr key={t.id_tarea}>
                            <td className="p-2 border">{t.id_tarea}</td>
                            <td className="p-2 border">{t.nombre_tarea}</td>
                            <td className="p-2 border flex gap-2 justify-center">
                                <button onClick={() => cargarTarea(t)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                                <button onClick={() => eliminarTarea(t.id_tarea)} className="bg-red-500 text-white px-2 rounded">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
