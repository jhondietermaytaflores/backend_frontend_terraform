import { supabase } from '../config/supabase.js'

// Listar todas las asignaciones
export const obtenerAsignaciones = async (req, res) => {
    const { data, error } = await supabase.from('asignaciones')
    .select(`
            *,
            usuario:usuario_id (
                id,
                nombre
            ),
            tipo_tarea:tarea_id (
                id_tarea,
                nombre_tarea
            ),
            habitacion:habitacion_id (
                id_habitacion, 
                numero
            )
        `)
    .order('fecha_asignacion', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

// Obtener asignación por ID
export const obtenerAsignacion_porID = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('asignaciones').select('*').eq('id_asignacion', id).single()
    if (error) return res.status(404).json({ error: 'Asignación no encontrada' })
    res.json(data)
}

// Crear asignación
export const crearAsignacion = async (req, res) => {
    const { usuario_id, tarea_id,habitacion_id,  descripcion, estado, fecha_asignacion } = req.body
    const { data, error } = await supabase.from('asignaciones').insert([{
        usuario_id,
        tarea_id,
        habitacion_id, 
        descripcion,
        estado,
        fecha_asignacion
    }])
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json(data)
}

// Actualizar asignación
export const actualizarAsignacion = async (req, res) => {
    const { id } = req.params
    const { usuario_id, tarea_id,habitacion_id,  descripcion, estado, fecha_asignacion } = req.body
    const { data, error } = await supabase.from('asignaciones').update({
        usuario_id,
        tarea_id,
        habitacion_id, // nuevo campo
        descripcion,
        estado,
        fecha_asignacion
    }).eq('id_asignacion', id)
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

// Eliminar asignación
export const eliminarAsignacion = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('asignaciones').delete().eq('id_asignacion', id)
    if (error) return res.status(500).json({ error: error.message })
    res.json({ mensaje: 'Asignación eliminada' })
}
