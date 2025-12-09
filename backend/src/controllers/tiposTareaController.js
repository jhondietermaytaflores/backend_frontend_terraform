import { supabase } from '../config/supabase.js'

// Obtener todas las tareas
export const obtenerTiposTarea = async (req, res) => {
    const { data, error } = await supabase.from('tipos_tarea').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

// Obtener una tarea por ID
export const obtenerTipoTarea = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('tipos_tarea').select('*').eq('id_tarea', id).single()
    if (error) return res.status(404).json({ error: 'Tipo de tarea no encontrado' })
    res.json(data)
}

// Crear nueva tarea
export const crearTipoTarea = async (req, res) => {
    const { nombre_tarea } = req.body
    const { data, error } = await supabase.from('tipos_tarea').insert([{ nombre_tarea }])
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json(data)
}

// Actualizar tarea
export const actualizarTipoTarea = async (req, res) => {
    const { id } = req.params
    const { nombre_tarea } = req.body
    const { data, error } = await supabase.from('tipos_tarea').update({ nombre_tarea }).eq('id_tarea', id)
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

// Eliminar tarea
export const eliminarTipoTarea = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('tipos_tarea').delete().eq('id_tarea', id)
    if (error) return res.status(500).json({ error: error.message })
    res.json({ mensaje: 'Tipo de tarea eliminado' })
}
