import { supabase } from '../config/supabase.js'

export const listarPorSector = async (req, res) => {
  const { data, error } = await supabase
    .from('inventario_sector')
    .select(`
      id, nombre_sector, inventario_id, cantidad, observacion,
      inventario(id_inventario, nombre)
    `)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const crearInventarioSector = async (req, res) => {
  const { nombre_sector, inventario_id, cantidad, observacion } = req.body

  const { data, error } = await supabase
    .from('inventario_sector')
    .insert([{ nombre_sector, inventario_id, cantidad, observacion }])
    .select()

  if (error || !data || !data.length)
    return res.status(500).json({ error: error?.message || 'No se pudo guardar' })

  res.json(data[0])
}

export const eliminarInventarioSector = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase
    .from('inventario_sector')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Eliminado correctamente' })
}
