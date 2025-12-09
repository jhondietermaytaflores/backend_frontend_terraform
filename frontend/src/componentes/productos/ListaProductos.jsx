function ListaProductos({ productos, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="dark:bg-[#143c43] text-white">
          <tr>
            <th className="p-2 text-left">Imagen</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Precio (Bs)</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-left">Acciones</th>

          </tr>
        </thead>
        <tbody className="dark:bg-[#246a76] text-white">
          {productos.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                    {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="h-12 rounded" />}
                </td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.precio.toFixed(2)}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.categoria}</td>
                <td className="p-2 space-x-2">
                <button
                    onClick={() => onEditar(p)}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Editar
                </button>
                <button
                    onClick={() => onEliminar(p.id)}
                    className="text-red-600 hover:underline text-sm"
                >
                    Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaProductos
