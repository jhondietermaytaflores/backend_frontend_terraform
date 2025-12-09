import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

function InicioAdmin() {
  const [resumen, setResumen] = useState({
    totalReservas: 0,
    habitacionesOcupadas: 0,
    pedidosPendientes: 0,
    totalIngresos: 0,
  })

  const [pedidosPorEstado, setPedidosPorEstado] = useState({})
  const [habitacionesPorEstado, setHabitacionesPorEstado] = useState({})

  const cargarDatos = async () => {
    try {
      const [res, habs, peds] = await Promise.all([
        api.get('/reservas'),
        api.get('/habitaciones'),
        api.get('/pedidos'),
      ])

      const reservas = res.data
      const habitaciones = habs.data
      const pedidos = peds.data

      const totalReservas = reservas.length
      const habitacionesOcupadas = habitaciones.filter(h => h.estado === 'ocupada').length
      const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length
      const totalIngresos = pedidos.reduce((acc, p) => acc + parseFloat(p.total || 0), 0)

      const agrupadoPedidos = {}
      pedidos.forEach(p => {
        agrupadoPedidos[p.estado] = (agrupadoPedidos[p.estado] || 0) + 1
      })

      const agrupadoHabitaciones = {}
      habitaciones.forEach(h => {
        agrupadoHabitaciones[h.estado] = (agrupadoHabitaciones[h.estado] || 0) + 1
      })

      setResumen({ totalReservas, habitacionesOcupadas, pedidosPendientes, totalIngresos })
      setPedidosPorEstado(agrupadoPedidos)
      setHabitacionesPorEstado(agrupadoHabitaciones)
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
    }
  }

  useEffect(() => {
    cargarDatos()
    const intervalo = setInterval(cargarDatos, 60000) // 1 minuto

    return () => clearInterval(intervalo) 
  }, [])

  const chartPedidos = {
    labels: Object.keys(pedidosPorEstado),
    datasets: [
      {
        label: 'Pedidos',
        data: Object.values(pedidosPorEstado),
        backgroundColor: ['#facc15', '#3b82f6', '#10b981', '#ef4444'],
        borderRadius: 6,
      },
    ],
  }

  const chartHabitaciones = {
    labels: Object.keys(habitacionesPorEstado),
    datasets: [
      {
        label: 'Habitaciones',
        data: Object.values(habitacionesPorEstado),
        backgroundColor: ['#3b82f6', '#f87171', '#fbbf24', '#8b5cf6'],
        borderColor: '#e5e7eb',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel de control</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardResumen titulo="Reservas totales" valor={resumen.totalReservas} color="bg-blue-600" />
        <CardResumen titulo="Habitaciones ocupadas" valor={resumen.habitacionesOcupadas} color="bg-yellow-500" />
        <CardResumen titulo="Pedidos pendientes" valor={resumen.pedidosPendientes} color="bg-red-500" />
        <CardResumen titulo="Ingresos (Bs)" valor={resumen.totalIngresos.toFixed(2)} color="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-700">📦 Pedidos por estado</h3>
          <Bar data={chartPedidos} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-700">🛏️ Estado de habitaciones</h3>
          <Doughnut data={chartHabitaciones} />
        </div>
      </div>
    </div>
  )
}

function CardResumen({ titulo, valor, color }) {
  return (
    <div className={`p-5 rounded shadow text-white ${color} transition transform hover:scale-105`}>
      <p className="text-sm uppercase tracking-wide">{titulo}</p>
      <h3 className="text-3xl font-bold mt-1">{valor}</h3>
    </div>
  )
}

export default InicioAdmin


/* <div className={`p-5 rounded shadow text-white ${color}`}>
      <p className="text-sm uppercase tracking-wide">{titulo}</p>
      <h3 className="text-2xl font-bold mt-1">{valor}</h3>
    </div> */