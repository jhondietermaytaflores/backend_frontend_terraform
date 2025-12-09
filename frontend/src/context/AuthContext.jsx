import { createContext, useEffect, useState } from 'react'
//, useContext
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  useEffect(() => {
    //const user = localStorage.getItem('usuario')
    const storedUser = localStorage.getItem('usuario')
    // a
    const storedToken = localStorage.getItem('token')
    //if (user) setUsuario(JSON.parse(user))
    if (storedUser && storedToken) {
      /* setUsuario(JSON.parse(storedUser))
      setToken(storedToken) */
      try {
        const parsedUser = JSON.parse(storedUser)
        // opcional: verificar estructura mínima, p.ej. parsedUser.id
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
          setUsuario(parsedUser)
          setToken(storedToken)
        } else {
          // si no tiene la forma esperada, limpiamos
          localStorage.removeItem('usuario')
          localStorage.removeItem('token')
        }
      } catch (e) {
        console.warn('AuthContext: stored "usuario" no es JSON válido, limpiando localStorage', e)
        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
      }
    }
  }, [])

  /* const login = (usuarioData) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioData))
    setUsuario(usuarioData)
  }

  const logout = () => {
    localStorage.removeItem('usuario')
    setUsuario(null)
  } */


  const login = (usuarioData, newToken) => {
    setUsuario(usuarioData)
    setToken(newToken)
    localStorage.setItem('usuario', JSON.stringify(usuarioData))
    localStorage.setItem('token', newToken)
  }
  const logout = () => {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
  }

  return (
      <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// <AuthContext.Provider value={{ usuario, login, logout }}>