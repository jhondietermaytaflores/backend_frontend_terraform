

function ListaInventario({ inventario, tipos, onEditar, onEliminar }) {
    const obtenerNombreTipo = (id_tipo) => {
        return tipos.find(t => t.id_tipo === id_tipo)?.nombre_tipo || 'Desconocido'
    }

    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2 text-left">Nombre</th>
                        <th className="p-2 text-left">Cantidad</th>
                        <th className="p-2 text-left">Unidad</th>
                        <th className="p-2 text-left">Tipo</th>
                        <th className="p-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inventario.map((i) => {
                        //if (!i?.id) return null
                        //console.log('Item:', i)
                        
                        
                        return (
                            <tr key={i.id_inventario} className="border-t hover:bg-gray-50">
                                <td className="p-2">{i.nombre}</td>
                                <td className="p-2">{i.cantidad}</td>
                                <td className="p-2">{i.unidad_medida}</td>
                                <td className="p-2">{obtenerNombreTipo(i.id_tipo)}</td>
                                <td className="p-2 space-x-2">
                                    <button onClick={() => onEditar(i)} className="text-blue-600 hover:underline text-sm">Editar</button>
                                    <button onClick={() => onEliminar(i.id_inventario)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                    
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ListaInventario
