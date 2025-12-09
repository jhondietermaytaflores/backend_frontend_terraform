import { useState } from "react"
import { api } from "../servicios/api"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

function Registro() {
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [telefono, setTelefono] = useState("")
  const [contrasena, setContrasena] = useState("")
  const navigate = useNavigate()

  const handleRegistro = async (e) => {
    e.preventDefault()
    try {
      await api.post("/auth/registro", {
        email: correo,
        password: contrasena,
        nombre,
        telefono,
      })
      Swal.fire("Registrado", "Tu cuenta ha sido creada", "success")
      navigate("/")
    } catch (err) {
      Swal.fire("Error", "No se pudo registrar", "error")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegistro} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Crear cuenta</h2>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 mb-3" />
        <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full border p-2 mb-3" />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border p-2 mb-3" />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="w-full border p-2 mb-3" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Registrarse
        </button>
      </form>
    </div>
  )
}

export default Registro
