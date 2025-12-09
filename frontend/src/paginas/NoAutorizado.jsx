export default function NoAutorizado() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">🚫 Acceso no autorizado</h1>
      <p className="text-gray-600 mt-2">No tienes permisos para ver esta página</p>
    </div>
  )
}
