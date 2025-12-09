/* export default function InicioCocinero() {
    return <h2 className="p-4 text-xl">Bienvenido, Cocinero</h2>
} */

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function InicioCocinero() {
    const [pedidosCocina, setPedidosCocina] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const r = await axios.get('/api/pedidos?rol=cocinero')
                setPedidosCocina(r.data)
            } catch (e) {
                Swal.fire('Error', 'No se pudieron cargar pedidos', 'error')
            }
        }
        fetch()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido, Cocinero</h1>
            <div className="bg-white rounded shadow overflow-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Pedido</th><th className="p-2">Estado</th><th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosCocina.map(p => (
                            <tr key={p.id}>
                                <td className="p-2">{p.items.map(i => i.nombre).join(', ')}</td>
                                <td className="p-2">{p.estado}</td>
                                <td className="p-2">
                                    <button className="text-green-600 hover:underline" onClick={async () => {
                                        try {
                                            await axios.put(`/api/pedidos/${p.id}/actualizar`, { estado: 'listo' })
                                            Swal.fire('¡Buen trabajo!', 'Pedido listo para servir', 'success')
                                            setPedidosCocina(prev => prev.filter(x => x.id !== p.id))
                                        } catch {
                                            Swal.fire('Error', 'No se pudo actualizar pedido', 'error')
                                        }
                                    }}>Marcar listo</button>
                                </td>
                            </tr>
                        ))}
                        {pedidosCocina.length === 0 && (
                            <tr><td colSpan="3" className="p-4 text-gray-500">No hay pedidos en cocina.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
