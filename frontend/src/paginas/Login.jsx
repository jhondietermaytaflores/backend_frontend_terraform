import { useState } from "react"
import { api } from "../servicios/api"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import FaceLoginDescriptors from "./empleados/FaceLoginDescriptors"
import { Dialog } from "@headlessui/react"

function Login() {
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [modalAbierto, setModalAbierto] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()


  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post("/auth/login", {
        email: correo,
        password: contrasena
      })

      const usuario = data.usuario
      const token = data.token

      if (!usuario || !token) {
        return Swal.fire("Error", "Respuesta inválida del servidor", "error")
      }

      login({ ...usuario, token })

      Swal.fire("Éxito", "Inicio de sesión correcto", "success")

      if (usuario.id_rol === 1) {
        navigate('/admin')
      } else if (usuario.id_rol === 2) {
        navigate('/recepcionista') //recepcionista
      } else if (usuario.id_rol === 3) {
        navigate('/cliente') //clientes
      } else if (usuario.id_rol === 4) {
        navigate('/camareros') //camareros
      } else if (usuario.id_rol === 5) {
        navigate('/cocinero') //cocinero
      } else {
        navigate('/limpieza') //limpieza
      }


    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      Swal.fire("Error", err.response?.data?.error || "Credenciales inválidas", "error")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#121212]  rounded-1xl border border-blue-500/60 bg-gradient-to-tr from-[#0F0F0F] to-[#0B0B0B] text-white shadow-2xl shadow-green-500/10 backdrop-blur-xl p-8 relative overflow-hidden">
      <form onSubmit={handleLogin} className="bg-[#111826] p-8 rounded-3xl border border-blue-600/80 shadow-lg w-96">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Bienvenido <br /> al Hotel las nutrias!<br /> Iniciar Sesión </h1>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@nutrias.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-green-700 dark:focus:border-green-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-green-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-green-700 dark:focus:border-green-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-green-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-gradient-to-r from-[#1D0826] to-[#4A96D9] hover:from-green-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-800"
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition duration-300"
        >
          Iniciar con rostro
        </button>

      </form>

      {/* Modal de login facial */}
      {/* <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1E1E2F] p-6 rounded shadow-lg">
            <Dialog.Title className="text-white text-xl mb-2">Login Facial</Dialog.Title>
            <FaceLoginDescriptors
              onSuccess={(usuario) => {
                login(usuario)
                setModalAbierto(false)
                Swal.fire("Éxito", `Bienvenido ${usuario.nombre}`, "success")
                if (usuario.id_rol === 1) {
                  navigate("/admin")
                } else {
                  navigate("/habitaciones")
                }
              }}
            />
            <button
              onClick={() => setModalAbierto(false)}
              className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded"
            >
              Cancelar
            </button>
          </Dialog.Panel>
        </div>
      </Dialog> */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} className="relative z-50">
        {/* Fondo oscuro */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        {/* Panel del modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-[400px] rounded-3xl border border-blue-500/60 bg-gradient-to-tr from-[#111826] to-[#0A1A2A] text-white shadow-2xl shadow-blue-500/10 backdrop-blur-xl p-8 relative overflow-hidden">

            {/* Fondo animado */}
            <div className="absolute inset-0 z-0">
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl opacity-30 animate-pulse" />
              <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-blue-500/5 blur-xl animate-ping" />
              <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-blue-500/5 blur-lg animate-ping delay-1000" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
            </div>

            {/* Contenido del Modal */}
            <div className="relative z-10">
              <Dialog.Title className="text-2xl font-bold text-blue-400 mb-4 text-center">Login Facial</Dialog.Title>

              <FaceLoginDescriptors
                onSuccess={(usuario) => {
                  login(usuario)
                  setModalAbierto(false)
                  Swal.fire("Éxito", `Bienvenido ${usuario.nombre}`, "success")
                  if (usuario.id_rol === 1) {
                    navigate("/admin")
                  } else {
                    navigate("/habitaciones")
                  }
                }}
              />

              <button
                onClick={() => setModalAbierto(false)}
                className="mt-6 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="ml-10 group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
        <div className="text-white rounded-3xl border border-blue-500/60 bg-gradient-to-tr from-[#111826] to-[#0A1A2A] shadow-2xl duration-700 z-10 relative backdrop-blur-xl hover:border-blue-500/40 overflow-hidden hover:shadow-blue-500/10 hover:shadow-3xl w-[350px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-blue-400/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700 animate-bounce delay-500" />
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-blue-500/5 blur-xl animate-ping" />
            <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-blue-500/5 blur-lg animate-ping delay-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-[200%] transition-transform duration-1000" />
          </div>
          <div className="p-8 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/60 animate-ping" />
                <div className="absolute inset-0 rounded-full border border-blue-500/50 animate-pulse delay-500" />
                <div className="p-6 rounded-full backdrop-blur-lg border border-blue-500/60 bg-gradient-to-br from-black/80 to-gray-900/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 hover:shadow-blue-500/20">
                  <div className="transform group-hover:rotate-180 transition-transform duration-700">
                    <svg className="w-8 h-8 text-blue-500 fill-current group-hover:text-blue-400 transition-colors duration-300 filter drop-shadow-lg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M8 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V16M21 8V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H16M21 16V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H16M7.5 8V9.5M16.5 8V9.5M11 12.6001C11.8 12.6001 12.5 11.9001 12.5 11.1001V8M15.2002 15.2C13.4002 17 10.5002 17 8.7002 15.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Iniciar con reconocimiento facial
                </p>
              </div>

              <div className="space-y-1 max-w-sm">
                <p className="text-white font-semibold text-base transform group-hover:scale-105 transition-transform duration-300 mb-6">
                  Solo si está registrado con datos faciales
                </p>
                <button
                  onClick={() => setModalAbierto(true)}
                  className="inline-block w-full text-gray-970 border border-blue-500 text-lg font-bold leading-relaxed transform group-hover:text-gray-200 transition-colors duration-300 "
                >
                  Iniciar
                </button>
              </div>

              <div className="mt-6 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500 animate-pulse" />

              <div className="flex space-x-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>



    </div>
  )
}

export default Login
