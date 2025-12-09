// src/paginas/empleados/MisTareas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MisTareas() {
    const [tareas, setTareas] = useState([])

    const usuario = JSON.parse(localStorage.getItem('usuario')) // si el usuario ya esta en localStorage

    useEffect(() => {
        const obtenerMisTareas = async () => {
            const { data } = await axios.get(`http://localhost:3001/api/asignaciones/usuario/${usuario.id}`)
            setTareas(data)
        }

        obtenerMisTareas()
    }, [usuario.id])

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Mis Tareas</h2>
            <table className="min-w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Tarea</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Estado</th>
                        <th className="p-2 border">Asignada</th>
                    </tr>
                </thead>
                <tbody>
                    {tareas.map(t => (
                        <tr key={t.id_asignacion}>
                            <td className="p-2 border">{t.tipo_tarea?.nombre_tarea || t.tarea_id}</td>
                            <td className="p-2 border">{t.descripcion}</td>
                            <td className="p-2 border">{t.estado}</td>
                            <td className="p-2 border">{new Date(t.fecha_asignacion).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
