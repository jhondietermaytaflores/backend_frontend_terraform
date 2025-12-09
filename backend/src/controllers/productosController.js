import { supabase } from '../config/supabase.js'
import { v4 as uuid } from 'uuid'

export const listarProductos = async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const crearProducto = async (req, res) => {
  const { data, error } = await supabase.from('productos').insert([req.body])
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

export const actualizarProducto = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase.from('productos').update(req.body).eq('id_producto', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}
export const eliminarProducto = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('productos').delete().eq('id_producto', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Producto eliminado' })
}

export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase.from('productos').select('*').eq('id_producto', id).single()
  if (error) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(data)
}



export const subirImagen = async (req, res) => {
  try {
    const archivo = req.file
    if (!archivo) return res.status(400).json({ error: 'No se subió archivo' })

    const nombreArchivo = `${uuid()}_${archivo.originalname}`

    console.log('Intentando subir archivo:', nombreArchivo)

    const { data, error } = await supabase.storage
      .from('productos')
      .upload(nombreArchivo, archivo.buffer, {
        contentType: archivo.mimetype,
        upsert: false,
      })

    if (error) {
      console.error('ERROR UPLOAD:', error)
      return res.status(500).json({ error: error.message })
    }

    const { data: urlData } = supabase.storage.from('productos').getPublicUrl(nombreArchivo)

    res.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Error en controlador subirImagen:', err)
    res.status(500).json({ error: err.message || 'Error desconocido' })
  }
}
