// src/controllers/rolesController.js
import { supabase } from '../config/supabase.js'

export const listarRoles = async (req, res) => {
    const { data, error } = await supabase.from('roles').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

export const crearRol = async (req, res) => {
    const { nombre } = req.body
    const { data, error } = await supabase
        .from('roles')
        .insert([{ nombre }])
        .select()
        .single()
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

export const obtenerRolPorId = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('roles').select('*').eq('id_rol', id).single()
    if (error) return res.status(404).json({ error: 'Rol no encontrado' })
    res.json(data)
}

export const actualizarRol = async (req, res) => {
    const { id } = req.params
    const { nombre } = req.body
    const { data, error } = await supabase
        .from('roles')
        .update({ nombre })
        .eq('id_rol', id)
        .select()
        .single()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
}
export const eliminarRol = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('roles').delete().eq('id_rol', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ mensaje: 'Rol eliminado' })
}
