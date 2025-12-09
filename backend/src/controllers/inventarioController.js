import { supabase } from '../config/supabase.js'

export const listarInventario = async (req, res) => {
    const { data, error } = await supabase.from('inventario').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

export const crearInventario = async (req, res) => {
    const { nombre, descripcion, cantidad, unidad_medida, id_tipo } = req.body
    /* const { data, error } = await supabase.from('inventario').insert([{ nombre, descripcion, cantidad, unidad_medida, id_tipo }])
    //if (error) return res.status(500).json({ error: error.message })
    //res.json(data[0])
    if (error || !data || !data[0]) {
        return res.status(500).json({ error: error?.message || 'No se pudo insertar  Cre_inven' })
    }
    res.json(data[0]) */

    const { data, error } = await supabase
        .from('inventario')
        .insert([{ nombre, descripcion, cantidad, unidad_medida, id_tipo }])
        .select()  // <-- esto es importante

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json(data[0])

}

export const actualizarInventario = async (req, res) => {
    const { id } = req.params
    const { nombre, descripcion, cantidad, unidad_medida, id_tipo } = req.body

    const { data, error } = await supabase
        .from('inventario')
        .update({ nombre, descripcion, cantidad, unidad_medida, id_tipo })
        .eq('id_inventario', id)

    /* if (error) return res.status(500).json({ error: error.message })
    res.json(data[0]) */
    if (error) return res.status(500).json({ error: error.message })
    //res.json(data[0])
    res.json({ message: 'Actualizado correctamente' })

}

export const eliminarInventario = async (req, res) => {
    const { id } = req.params
    //const { error } = await supabase.from('inventario').delete().eq('id', id)
    const { error } = await supabase.from('inventario').delete().eq('id_inventario', id)
    if (error) return res.status(500).json({ error: error.message })
    res.json({ message: 'Eliminado correctamente' })
}
