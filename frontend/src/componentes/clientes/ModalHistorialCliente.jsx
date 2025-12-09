function ModalHistorialCliente({ visible, onClose, cliente, historial }) {
    if (!visible || !cliente) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-full max-w-3xl overflow-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-2">Historial de {cliente.nombres}</h2>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Reservas</h3>
                    <table className="w-full text-sm mt-2 border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Habitación</th>
                                <th>Entrada</th>
                                <th>Salida</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial?.reservas?.map((r, i) => (
                                <tr key={i} className="border-t text-center">
                                    <td className="p-2">{r.habitaciones?.numero || '-'}</td>
                                    <td>{r.fecha_entrada}</td>
                                    <td>{r.fecha_salida}</td>
                                    <td>{r.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Pedidos</h3>
                    <table className="w-full text-sm mt-2 border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">ID</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial?.pedidos?.map((p, i) => (
                                <tr key={i} className="border-t text-center">
                                    <td className="p-2">{p.id_pedido}</td>
                                    <td>{p.total}</td>
                                    <td>{p.estado}</td>
                                    <td>{new Date(p.fecha_pedido).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="text-right mt-6">
                    <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded">Cerrar</button>
                </div>
            </div>
        </div>
    )
}

export default ModalHistorialCliente
