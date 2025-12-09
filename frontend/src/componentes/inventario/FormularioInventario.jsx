import { useEffect, useState } from 'react'

function FormularioInventario({ item, tipos, onGuardar, onCancelar }) {
    const [form, setForm] = useState({
        id: null,
        nombre: '',
        descripcion: '',
        cantidad: '',
        unidad_medida: '',
        id_tipo: '',
    })

    useEffect(() => {
        if (item) {
            setForm({
                //id: item.id ?? null,
                id_inventario: item.id_inventario ?? null,
                nombre: item.nombre,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                unidad_medida: item.unidad_medida,
                id_tipo: item.id_tipo,
            })
        } else {
            setForm({
                id: null,
                nombre: '',
                descripcion: '',
                cantidad: '',
                unidad_medida: '',
                id_tipo: '',
            })
        }
    }, [item])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onGuardar(form)
        setForm({ id: null, nombre: '', descripcion: '', cantidad: '', unidad_medida: '', id_tipo: '' })
    }

    const unidades = ['unidades', 'kilos', 'cajas', 'paquetes', 'botellas', 'libras', 'galones'
        , 'litros', 'piezas', 'rollos', 'lotes', 'toneladas', 'gramos', 'metros', 'centímetros'
    ]


    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre del ítem" value={form.nombre} onChange={handleChange} className="border p-2 rounded" required />
            <input type="number" name="cantidad" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} className="border p-2 rounded" required />
            {/* <input type="text" name="unidad_medida" placeholder="Unidad (ej. litros, unidades)" value={form.unidad_medida} onChange={handleChange} className="border p-2 rounded" /> */}

            <select
                name="unidad_medida" value={form.unidad_medida} onChange={handleChange} className="border p-2 rounded" required
            >
                <option value="">Seleccione unidad</option>
                {unidades.map((u) => (
                    <option key={u} value={u}>{u}</option>
                ))}
            </select>


            <select name="id_tipo" value={form.id_tipo} onChange={handleChange} className="border p-2 rounded" required>
                <option value="">Seleccione tipo</option>
                {tipos.map((t) => (
                    <option key={t.id_tipo} value={t.id_tipo}>{t.nombre_tipo}</option>
                ))}
            </select>
            <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="border p-2 rounded col-span-2" />
            <div className="flex gap-4 col-span-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    {item ? 'Actualizar' : 'Guardar'}
                </button>
                {item && (
                    <button type="button" onClick={onCancelar} className="text-red-500 underline">
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}

export default FormularioInventario
