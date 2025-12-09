import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'
import { FaCheck, FaTimes, FaBed } from 'react-icons/fa'

function ReservasAdmin() {
  const [reservas, setReservas] = useState([])
  const [filtro, setFiltro] = useState('todos')

  const cargarReservas = async () => {
    const { data } = await api.get('/reservas')
    setReservas(data)
  }

  const filtrarReservas = () => {
    return filtro === 'todos'
      ? reservas
      : reservas.filter((r) => r.estado === filtro)
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    const confirm = await Swal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'finalizado' ? 'finalizar' : 'cancelar'} esta reserva?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
    })

    if (confirm.isConfirmed) {
      await api.put(`/reservas/${id}`, { estado: nuevoEstado })
      Swal.fire('Actualizado', `Reserva ${nuevoEstado}`, 'success')
      cargarReservas()
    }
  }

  useEffect(() => {
    cargarReservas()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Reservas</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrar por estado:</label>
        <select
          className="border px-3 py-1 rounded dark:bg-[#143c43] text-white"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="reservado">Reservado</option>
          <option value="ocupado">Ocupado</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="dark:bg-[#143c43] text-white">
            <tr>
              <th className="p-3">Cliente</th>
              <th>Habitación</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="dark:bg-[#246c79] text-white">
            {filtrarReservas().map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.cliente_id}</td>
                <td>{r.habitacion_id}</td>
                <td>{r.fecha_entrada}</td>
                <td>{r.fecha_salida}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                      r.estado === 'reservado'
                        ? 'bg-blue-500'
                        : r.estado === 'ocupado'
                        ? 'bg-yellow-500'
                        : r.estado === 'finalizado'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {r.estado}
                  </span>
                </td>
                <td>{r.observaciones || '—'}</td>
                <td className="text-center space-x-2">
                  {r.estado !== 'finalizado' && r.estado !== 'cancelado' && (
                    <>
                      <button
                        onClick={() => cambiarEstado(r.id, 'finalizado')}
                        className="text-green-600 hover:text-green-800"
                        title="Finalizar"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => cambiarEstado(r.id, 'cancelado')}
                        className="text-red-600 hover:text-red-800"
                        title="Cancelar"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  {r.estado === 'finalizado' && (
                    <span className="text-gray-400 text-sm">✔ Finalizado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReservasAdmin
