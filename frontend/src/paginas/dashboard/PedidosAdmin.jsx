import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'
import { FaClipboardCheck, FaClipboardList, FaShippingFast, FaCheck, FaTimes } from 'react-icons/fa'
import dayjs from 'dayjs'
import axios from 'axios'


function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([])

  
  const cargarPedidos = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/pedidos')
      setPedidos(data)
    } catch (err) {
      console.error('Error cargando pedidos:', err)
      Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error')
    }
  }

  const cambiarEstado = async (pedido, nuevoEstado) => {
    const confirm = await Swal.fire({
      title: `¿Marcar como "${nuevoEstado}"?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
    })

    

    try {
      await api.put(`/pedidos/${pedido.id_pedido}`, { estado: nuevoEstado })
      Swal.fire('Actualizado', 'Estado del pedido modificado', 'success')
      cargarPedidos()
    } catch (error) {
      console.error('Error actualizando estado:', error)
      Swal.fire('Error', 'No se pudo actualizar estado', 'error')
    }
  }

  const verDetalle = async (pedidoId) => {
    try {
      const { data } = await api.get(`/pedidos/${pedidoId}`)
      
      const cliente = data.cliente
      const usuario = data.usuario
      const fecha = dayjs(data.fecha_pedido).format('DD/MM/YYYY HH:mm')
      let productosHtml = '<ul style="text-align:left;">'
      data.detalle_pedido.forEach(d => {
        productosHtml += `<li>
          ${d.productos?.nombre || 'Producto'} - Cantidad: ${d.cantidad} - Precio U: Bs ${d.precio_unitario.toFixed(2)} - Subtotal: Bs ${(d.cantidad * d.precio_unitario).toFixed(2)}
        </li>`
      })
      productosHtml += '</ul>'

      const html = `
        <p><strong>Cliente:</strong> ${cliente?.nombre || ''} ${cliente?.apellido || ''} (${cliente?.correo || ''})</p>
        <p><strong>Solicitado por (usu.):</strong> ${usuario?.nombre || ''} (${usuario?.correo || ''})</p>
        <p><strong>Fecha pedido:</strong> ${fecha}</p>
        <p><strong>Método de pago:</strong> ${data.metodo_pago || '-'}</p>
        <p><strong>Tipo comprobante:</strong> ${data.tipo_comprobante || '-'}</p>
        <p><strong>Total:</strong> Bs ${Number(data.total).toFixed(2)}</p>
        <hr />
        <p><strong>Productos:</strong></p>
        ${productosHtml}
      `
      Swal.fire({
        title: `Detalle Pedido #${pedidoId}`,
        html,
        width: '600px',
        confirmButtonText: 'Cerrar'
      })
    } catch (error) {
      console.error('Error obteniendo detalle:', error)
      Swal.fire('Error', 'No se pudo cargar detalle del pedido', 'error')
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Pedidos</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="dark:bg-[#143c43] text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className='p-3'>Total</th>
              <th className='p-3'>Estado</th>
              <th className='p-3'>Fecha</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className='dark:bg-[#246b77] text-white'>
            {pedidos.map((p) => (
              <tr key={p.id_pedido} className="border-t">
                <td className="p-3">{p.id_pedido}</td>
                <td className="p-3">{p.cliente?.nombre} {p.cliente?.apellido}</td>
                <td className="p-3">Bs {Number(p.total).toFixed(2)}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${p.estado === 'pendiente'
                        ? 'bg-yellow-500'
                        : p.estado === 'por entregar'
                          ? 'bg-blue-500'
                          : p.estado === 'entregado'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                      }`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="p-3">
                  {dayjs(p.fecha_pedido).format('DD/MM/YYYY')}
                </td>
                <td className="text-center p-3 space-x-2">
                  
                  <button
                    onClick={() => verDetalle(p.id_pedido)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Ver detalle"
                  >
                    <FaClipboardList />
                  </button>
                  
                  {p.estado === 'pendiente' && (
                    <button
                      onClick={() => cambiarEstado(p, 'por entregar')}
                      className="text-blue-600 hover:text-blue-800"
                      title="Marcar por entregar"
                    >
                      <FaShippingFast />
                    </button>
                  )}
                  {p.estado === 'por entregar' && (
                    <button
                      onClick={() => cambiarEstado(p, 'entregado')}
                      className="text-green-600 hover:text-green-800"
                      title="Marcar entregado"
                    >
                      <FaCheck />
                    </button>
                  )}
                  {p.estado !== 'cancelado' && p.estado !== 'entregado' && (
                    <button
                      onClick={() => cambiarEstado(p, 'cancelado')}
                      className="text-red-600 hover:text-red-800"
                      title="Cancelar pedido"
                    >
                      <FaTimes />
                    </button>
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

export default PedidosAdmin
