/* export default function InicioLimpieza() {
    return <h2 className="p-4 text-xl">Bienvenido, Limpieza</h2>
} */

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function InicioLimpieza() {
    const [habitacionesListas, setHabitacionesListas] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const r = await axios.get('/api/habitaciones?estado=limpieza_pendiente')
                setHabitacionesListas(r.data)
            } catch (e) {
                Swal.fire('Error', 'No se pudieron cargar las habitaciones', 'error')
            }
        }
        fetch()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido, Limpieza</h1>
            <div className="bg-white shadow-md rounded p-4">
                <h2 className="text-xl font-semibold mb-2">Habitaciones pendientes</h2>
                {habitacionesListas.length === 0
                    ? <p className="text-gray-500">No hay habitaciones por limpiar.</p>
                    : habitacionesListas.map(h => (
                        <div key={h.id_habitacion} className="py-2 border-b flex justify-between items-center">
                            <span>Habitación <strong>{h.numero}</strong></span>
                            <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={async () => {
                                try {
                                    await axios.put(`/api/habitaciones/${h.id_habitacion}`, { estado: 'disponible' })
                                    Swal.fire('Listo', 'Habitación marcada como limpia', 'success')
                                    setHabitacionesListas(prev => prev.filter(x => x.id_habitacion !== h.id_habitacion))
                                } catch {
                                    Swal.fire('Error', 'No se pudo actualizar habitación', 'error')
                                }
                            }}>Marcar limpia</button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
