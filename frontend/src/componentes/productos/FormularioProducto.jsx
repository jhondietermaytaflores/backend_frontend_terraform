import { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import Swal from 'sweetalert2'
import { api } from '../../servicios/api'




function FormularioProducto({ onGuardar, producto, cancelar }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    imagen_url: '',
  })

  useEffect(() => {
    if (producto) setForm(producto)
  }, [producto])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    Toast.fire({ icon: 'success', title: producto ? 'Producto actualizado' : 'Producto creado' })

    onGuardar(form)
    setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen_url: '' })
  }

  const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})


  //manejo de imagenes
  const handleImagen = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    return Swal.fire({
      icon: 'error',
      title: 'Archivo demasiado grande',
      text: 'El tamaño máximo es 5MB',
    })
  }

  Toast.fire({ icon: 'info', title: 'Comprimiendo imagen...' })

  try {
    const opciones = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    }

    const imagenComprimida = await imageCompression(file, opciones)

    const formData = new FormData()
    formData.append('imagen', imagenComprimida)

    Toast.fire({ icon: 'info', title: 'Subiendo imagen...' })

    const { data } = await api.post('/productos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    setForm({ ...form, imagen_url: data.url })

    Toast.fire({ icon: 'success', title: 'Imagen subida correctamente' })
  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Error al subir imagen',
      text: err?.message || 'Algo salió mal',
    })
  }
}




  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        className="border p-2 rounded text-black"
        required
      />
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
        className="border p-2 rounded text-black"
        required
      />
      <input
        type="text"
        name="categoria"
        placeholder="Categoría"
        value={form.categoria}
        onChange={handleChange}
        className="border p-2 rounded text-black"
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        className="border p-2 rounded text-black"
      />
      <input
        type="text"
        name="imagen_url"
        placeholder="URL de imagen"
        value={form.imagen_url}
        onChange={handleChange}
        className="border p-2 rounded text-black"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImagen}
        className="border p-2 rounded text-black"
        required={!form.imagen_url}
      />

      {form.imagen_url && (
        <img src={form.imagen_url} alt="Vista previa" className="h-24 mt-2 rounded shadow" />
      )}


      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
        className="border p-2 rounded col-span-1 md:col-span-2 text-black"
      />
      <div className="flex gap-4 col-span-1 md:col-span-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {producto ? 'Actualizar' : 'Guardar'}
        </button>
        {producto && (
          <button onClick={cancelar} type="button" className="text-red-500 underline">
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  )
}

export default FormularioProducto
