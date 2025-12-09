import { supabase } from '../config/supabase.js'


export const listarHabitaciones = async (req, res) => {
  const { data, error } = await supabase.from('habitaciones').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const obtenerTodas = async (req, res) => {
  const { data, error } = await supabase
    .from('habitaciones')
    .select(`
      id_habitacion,
      numero,
      descripcion,
      precio,
      estado,
      creado_en,
      id_piso, id_categoria,
      pisos(nombre_piso),
      categorias_habitacion(nombre_categoria)
    `)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
//.select('*,pisos(nombre_piso), categorias_habitacion(nombre_categoria)')

export const crear = async (req, res) => {
  const { data, error } = await supabase.from('habitaciones').insert([req.body])
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

export const actualizar = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase.from('habitaciones').update(req.body).eq('id_habitacion', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

export const eliminar = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('habitaciones').delete().eq('id_habitacion', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Habitación eliminada' })
}



export const obtenerHabitacionesDisponibles = async (req, res) => {
  const { data, error } = await supabase
    .from('habitaciones')
    .select('*, categorias_habitacion(nombre_categoria), pisos(nombre_piso)')
    .eq('estado', 'libre')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}


// para el select de pisos en el formulario de crear/editar habitación
export const obtenerPisos = async (req, res) => {
  const { data, error } = await supabase.from('pisos').select('id_piso, nombre_piso').eq('estado', '1')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
// para el select de categorias en el formulario de crear/editar habitación
export const obtenerCategoriasHabitacion = async (req, res) => {
  const { data, error } = await supabase.from('categorias_habitacion').select('id_categoria, nombre_categoria').eq('estado', '1')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const listarHabitacionesDisponibles = async (req, res) => {
  const { data, error } = await supabase
    .from('habitaciones')
    .select('*')
    .eq('estado', 'libre')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}



/* export const crearHabitacion = async (req, res) => {
  const { numero, tipo } = req.body
  const { data, error } = await supabase.from('habitaciones').insert([{ numero, tipo, disponible: true }])

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

export const listarDisponibles = async (_, res) => {
  const { data, error } = await supabase.from('habitaciones').select('*').eq('disponible', true)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const asignarHabitacion = async (req, res) => {
  const { habitacion_id, usuario_id } = req.body
  const { data, error } = await supabase
    .from('habitaciones')
    .update({ disponible: false, usuario_id })
    .eq('id', habitacion_id)

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}
 */