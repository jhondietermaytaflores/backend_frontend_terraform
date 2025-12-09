import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import CardHabitacion from '../../componentes/habitaciones/CardHabitacion'
import ModalReservaRapida from '../../componentes/habitaciones/ModalReservaRapida'
import FiltroEstado from '../../componentes/habitaciones/FiltroEstado'

function CatalogoHabitaciones() {
    const [habitaciones, setHabitaciones] = useState([])
    const [filtro, setFiltro] = useState('')
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null)

    const cargarHabitaciones = async () => {
        const { data } = await api.get('/habitaciones/todas')
        setHabitaciones(data)
    }

    useEffect(() => {
        cargarHabitaciones()
    }, [])

    const filtradas = filtro ? habitaciones.filter(h => h.estado === filtro) : habitaciones

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-700">Catálogo de Habitaciones</h2>
                <FiltroEstado estadoSeleccionado={filtro} onChange={setFiltro} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtradas.map(h => (
                    <CardHabitacion key={h.id_habitacion} habitacion={h} onReservar={setHabitacionSeleccionada} />
                ))}
            </div>

            {habitacionSeleccionada && (
                <ModalReservaRapida habitacion={habitacionSeleccionada} onClose={() => {
                    setHabitacionSeleccionada(null)
                    cargarHabitaciones()
                }} />
            )}
        </div>
    )
}

export default CatalogoHabitaciones
