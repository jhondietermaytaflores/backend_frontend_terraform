
const colores = {
  Mueble: 'bg-blue-500',
  'Ropa blanca': 'bg-yellow-500',
  Electrodoméstico: 'bg-indigo-500',
  Alimentos: 'bg-green-600',
}

function TarjetaInventario({ tipo, cantidad }) {
  const color = colores[tipo] || 'bg-gray-400'

  return (
    <div className={`p-4 rounded shadow text-white ${color}`}>
      <p className="text-sm uppercase">{tipo}</p>
      <h3 className="text-2xl font-bold">{cantidad}</h3>
    </div>
  )
}

export default TarjetaInventario
