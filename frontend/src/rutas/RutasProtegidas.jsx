import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// 🔒 Solo ADMIN
export const RutaAdmin = ({ children }) => {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/" />
  if (usuario.id_rol !== 1) return <Navigate to="/no-autorizado" />
  return children
}

// 🔒 Solo CLIENTE
/* export const RutaCliente = ({ children }) => {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/" />
  if (usuario.id_rol !== 3) return <Navigate to="/no-autorizado" />
  return children
} */


// 🔒 Rutas protegidas para empleados según su rol

export function RutaCliente({ children }) {
  const { usuario } = useAuth()
  return usuario?.id_rol === 3 ? children : <Navigate to="/no-autorizado" />
}

export function RutaRecepcionista({ children }) {
  const { usuario } = useAuth()
  return usuario?.id_rol === 2 ? children : <Navigate to="/no-autorizado" />
}

export function RutaCamarero({ children }) {
  const { usuario } = useAuth()
  return usuario?.id_rol === 4 ? children : <Navigate to="/no-autorizado" />
}

export function RutaCocinero({ children }) {
  const { usuario } = useAuth()
  return usuario?.id_rol === 5 ? children : <Navigate to="/no-autorizado" />
}

export function RutaLimpieza({ children }) {
  const { usuario } = useAuth()
  return usuario?.id_rol === 6 ? children : <Navigate to="/no-autorizado" />
}