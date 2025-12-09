import { supabase } from '../config/supabase.js'

export const listarPorHabitacion = async (req, res) => {
  const { data, error } = await supabase
    .from('inventario_habitacion')
    .select('id, habitacion_id, inventario_id, cantidad, estado, inventario(nombre), habitaciones(numero)')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const crearInventarioHabitacion = async (req, res) => {
  const { habitacion_id, inventario_id, cantidad, estado } = req.body

  const nuevoRegistro = {
    habitacion_id,
    inventario_id,
    cantidad,
    estado: estado || 'en uso'
  }

  const { data, error } = await supabase
    .from('inventario_habitacion')
    .insert([nuevoRegistro])
    .select()

  if (error) {
    console.error("❌ Error al insertar en inventario_habitacion:", error)
    return res.status(500).json({ error: "No se pudo crear el registro" })
  }

  return res.json({ mensaje: 'Ítem asignado correctamente', id: data?.[0]?.id })
}


export const eliminarInventarioHabitacion = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('inventario_habitacion').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Eliminado correctamente' })
}
