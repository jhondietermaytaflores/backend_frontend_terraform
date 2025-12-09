import { supabase } from '../config/supabase.js'

export const listarTiposInventario = async (req, res) => {
  const { data, error } = await supabase.from('tipos_inventario').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const crearTipoInventario = async (req, res) => {
  const { nombre_tipo } = req.body
  const { data, error } = await supabase.from('tipos_inventario').insert([{ nombre_tipo }])
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

export const eliminarTipoInventario = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('tipos_inventario').delete().eq('id_tipo', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Tipo eliminado correctamente' })
}
