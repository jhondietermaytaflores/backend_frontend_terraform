import { useEffect, useState } from "react"
import { api } from "../../servicios/api"

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([])

  useEffect(() => {
    const fetchHabitaciones = async () => {
      const { data } = await api.get("/habitaciones/disponibles")
      setHabitaciones(data)
    }
    fetchHabitaciones()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Habitaciones disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {habitaciones.map((hab) => (
          <div key={hab.id_habitacion} className="border p-4 rounded shadow">
            <h2 className="font-bold">{hab.numero}</h2>
            <p>{hab.descripcion}</p>
            <p><b>Precio:</b> Bs {hab.precio}</p>
            <p><b>Piso:</b> {hab.pisos?.nombre_piso}</p>
            <p><b>Tipo:</b> {hab.categorias_habitacion?.nombre_categoria}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Habitaciones
