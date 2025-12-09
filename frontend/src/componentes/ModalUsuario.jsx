import { useState, useEffect } from 'react'
import { api } from '../servicios/api'


function ModalUsuario({ visible, onClose, onSubmit, userEdit, soloRoles = null }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    id_rol: '3',
  })

  const [roles, setRoles] = useState([])

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const { data } = await api.get('/roles')
        // Si soloRoles está definido (ej: ['administrador', 'camarero']), filtramos
        const filtrados = soloRoles
          ? data.filter(r => soloRoles.includes(r.nombre_rol))
          : data
        setRoles(filtrados)
      } catch (err) {
        console.error('Error al cargar roles:', err)
      }
    }

    cargarRoles()
  }, [soloRoles])

  useEffect(() => {
    if (userEdit) {
      setForm({
        nombre: userEdit.nombre,
        correo: userEdit.correo,
        telefono: userEdit.telefono,
        id_rol: userEdit.id_rol,
        contrasena: '', // evitar mostrar contraseña
      })
    }
  }, [userEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    /* if (!userEdit && !form.contrasena) {
      alert("Contraseña requerida para nuevo usuario")
      return
    } */
    onSubmit(form)
  }

  if (!visible) return null


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{userEdit ? 'Editar' : 'Nuevo'} Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full border p-2 rounded" required />
          <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="w-full border p-2 rounded" type="email" required />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full border p-2 rounded" required />

          <input name="contrasena" value={form.contrasena} 
          onChange={handleChange} placeholder="Contraseña (opcional)" 
          className="w-full border p-2 rounded" 
          type="password"  />

          <select name="id_rol" value={form.id_rol} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Seleccione rol</option>      
            {roles.map((r) => (
              <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>
            ))}

          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{userEdit ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalUsuario