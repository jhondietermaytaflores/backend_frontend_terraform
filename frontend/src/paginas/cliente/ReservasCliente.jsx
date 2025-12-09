import { useEffect, useState } from "react"
import { api } from "../../servicios/api"
import Swal from "sweetalert2"

function Reservas() {
  const [habitaciones, setHabitaciones] = useState([])
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState("")
  const [fechaEntrada, setFechaEntrada] = useState("")
  const [fechaSalida, setFechaSalida] = useState("")

  const usuario_id = 3 // ⚠️ Simulación: esto debería obtenerse del token o contexto
  const cliente_id = 1 // ⚠️ Simulación: depende del backend

  useEffect(() => {
    api.get("/habitaciones/disponibles").then(({ data }) => {
      setHabitaciones(data)
    })
  }, [])

  const reservar = async (e) => {
    e.preventDefault()
    if (!habitacionSeleccionada || !fechaEntrada || !fechaSalida) {
      return Swal.fire("Error", "Completa todos los campos", "warning")
    }

    try {
      await api.post("/reservas", {
        cliente_id,
        habitacion_id: parseInt(habitacionSeleccionada),
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
        observaciones: "Reserva desde panel web"
      })
      Swal.fire("Reservado", "La habitación fue reservada correctamente", "success")
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "No se pudo completar la reserva", "error")
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reservar habitación</h1>
      <form onSubmit={reservar} className="space-y-4">
        <div>
          <label className="block">Habitación:</label>
          <select
            className="w-full border p-2"
            value={habitacionSeleccionada}
            onChange={(e) => setHabitacionSeleccionada(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {habitaciones.map((h) => (
              <option key={h.id_habitacion} value={h.id_habitacion}>
                {h.numero} - {h.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Fecha de entrada:</label>
          <input
            type="date"
            className="w-full border p-2"
            value={fechaEntrada}
            onChange={(e) => setFechaEntrada(e.target.value)}
          />
        </div>

        <div>
          <label className="block">Fecha de salida:</label>
          <input
            type="date"
            className="w-full border p-2"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
          Confirmar reserva
        </button>
      </form>
    </div>
  )
}

export default Reservas
