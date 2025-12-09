import { useEffect, useState } from 'react'
import { api } from '../../servicios/api'
import TarjetaInventario from '../../componentes/inventario/TarjetaInventario'
import ListaInventario from '../../componentes/inventario/ListaInventario'
import FormularioInventario from '../../componentes/inventario/FormularioInventario'
import Swal from 'sweetalert2'

function InventarioAdmin() {
    const [inventario, setInventario] = useState([])
    const [tipos, setTipos] = useState([])
    const [itemEditar, setItemEditar] = useState(null)

    const cargarDatos = async () => {
        const [inv, tipos] = await Promise.all([
            api.get('/inventario'),
            api.get('/tipos-inventario'),
        ])
        // console.log("📦 Inventario:", inv.data)
        // console.log("🧩 Tipos:", tipos.data)
        setInventario(inv.data)
        setTipos(tipos.data)
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const guardarItem = async (item) => {

        try {
            if (item.id_inventario) {
                await api.put(`/inventario/${item.id_inventario}`, item)
                Swal.fire('Actualizado', 'Ítem actualizado correctamente', 'success')
            } else {
                await api.post('/inventario', item)
                Swal.fire('Agregado', 'Ítem registrado correctamente', 'success')
            }
            setItemEditar(null)
            cargarDatos()
        } catch (err) {
            console.error("Error guardando ítem:", err)
            Swal.fire("Error", "No se pudo guardar el ítem", "error")
        }
    }

    const eliminarItem = async (id_inventario) => {

        const confirm = await Swal.fire({
            title: '¿Eliminar ítem?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
        })

        /* if (!id_inventario) {
            return Swal.fire("Error", "ID inválido", "error")
        } */

        //console.log("ID que se enviará al eliminar:", i.id_inventario)

        try {
            await api.delete(`/inventario/${id_inventario}`)
            Swal.fire('Eliminado', 'Ítem eliminado correctamente', 'success')
            cargarDatos()
        } catch (err) {
            console.error("Error al eliminar:", err)
            Swal.fire("Error", "No se pudo eliminar el ítem", "error")
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {tipos.map((tipo) => (
                    <TarjetaInventario
                        key={tipo.id_tipo}
                        tipo={tipo.nombre_tipo}
                        cantidad={inventario.filter(i => i.id_tipo === tipo.id_tipo).length}
                    />
                ))}
            </div>

            <FormularioInventario
                item={itemEditar}
                tipos={tipos}
                onGuardar={guardarItem}
                onCancelar={() => setItemEditar(null)}
            />

            <ListaInventario
                inventario={inventario}
                tipos={tipos}
                onEditar={(item) => setItemEditar(item)}
                onEliminar={eliminarItem}
            />
        </div>
    )
}

export default InventarioAdmin
