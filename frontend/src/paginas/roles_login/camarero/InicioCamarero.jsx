/* export default function InicioCamarero() {
    return <h2 className="p-4 text-xl">Bienvenido, Camarero</h2>
}
 */

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function InicioCamarero() {
    const [pedidosMesas, setPedidosMesas] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const r = await axios.get('/api/pedidos?rol=camarero')
                setPedidosMesas(r.data)
            } catch (e) {
                Swal.fire('Error', 'No se pudieron cargar pedidos', 'error')
            }
        }
        fetch()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido, Camarero</h1>
            <div className="bg-white rounded shadow overflow-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Mesa</th><th className="p-2">Pedido</th><th className="p-2">Estado</th><th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosMesas.map(p => (
                            <tr key={p.id}>
                                <td className="p-2">{p.mesa_numero}</td>
                                <td className="p-2">{p.items.map(i => i.nombre).join(', ')}</td>
                                <td className="p-2">{p.estado}</td>
                                <td className="p-2">
                                    <button className="text-indigo-600 hover:underline" onClick={async () => {
                                        try {
                                            await axios.put(`/api/pedidos/${p.id}/actualizar`, { estado: 'servido' })
                                            Swal.fire('Listo', 'Pedido marcado como servido', 'success')
                                            setPedidosMesas(prev => prev.filter(x => x.id !== p.id))
                                        } catch {
                                            Swal.fire('Error', 'No se pudo actualizar pedido', 'error')
                                        }
                                    }}>Servir</button>
                                </td>
                            </tr>
                        ))}
                        {pedidosMesas.length === 0 && (
                            <tr><td colSpan="4" className="p-4 text-gray-500">No tienes pedidos en curso.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
