import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import Swal from 'sweetalert2'
import ListaProductos from '../../componentes/productos/ListaProductos'
import FormularioProducto from '../../componentes/productos/FormularioProducto'

function ProductosAdmin() {
    const [productos, setProductos] = useState([])
    const [productoEditar, setProductoEditar] = useState(null)

    const cargarProductos = async () => {
        const { data } = await api.get('/productos')
        setProductos(data)
    }

    useEffect(() => {
        cargarProductos()
    }, [])

    const guardarProducto = async (producto) => {
        if (producto.id) {
            await api.put(`/productos/${producto.id}`, producto)
            Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success')
        } else {
            await api.post('/productos', producto)
            Swal.fire('Guardado', 'Producto registrado correctamente', 'success')
        }

        setProductoEditar(null)
        cargarProductos()
    }

    const eliminarProducto = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar producto?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
        })

        if (confirm.isConfirmed) {
            await api.delete(`/productos/${id}`)
            Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success')
            cargarProductos()
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>

            <FormularioProducto
                onGuardar={guardarProducto}
                producto={productoEditar}
                cancelar={() => setProductoEditar(null)}
            />

            <ListaProductos
                productos={productos}
                onEditar={(p) => setProductoEditar(p)}
                onEliminar={eliminarProducto}
            />
        </div>
    )
}

export default ProductosAdmin
