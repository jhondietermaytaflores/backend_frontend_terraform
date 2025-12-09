import { supabase  } from '../config/supabase.js'
import dotenv from 'dotenv';
dotenv.config();


export const registrar = async (req, res) => {
  const { email, password, nombre, telefono } = req.body

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  const user_id = data.user?.id
  if (!user_id) return res.status(500).json({ error: 'Usuario no creado ' })

  // Crea en tabla usuarios personalizada
  await supabase.from('usuarios').insert([{
    nombre,
    correo: email,
    contrasena: password,
    telefono,
    id_rol: 3 // cliente
  }])

  res.json({ message: 'Usuario registrado correctamente' })
}

export const login = async (req, res) => {

  console.log("BODY RECIBIDO:", req.body)

  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(401).json({ error: 'Credenciales inválidas' })

  const { data: usuarios } = await supabase.from('usuarios').select('*')
  const usuario = usuarios.find(u => u.correo === email)

  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })

  return res.json({
    token: data.session.access_token,
    usuario:{
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      id_rol: usuario.id_rol
    }
  })



  /* const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(401).json({ error: 'Credenciales inválidas' })

  res.json({ token: data.session.access_token, user: data.user }) */
}


//Login facial usando ID del usuario
export const loginFacial = async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'Falta el ID del usuario' })
  }

  // Buscar usuario por ID en la tabla personalizada
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  // login ( pasando por Supabase Auth )

  // Buscar el user UUID de Supabase Auth
  const { data: userAuthData, error: userError } = await supabase
    .auth.admin.listUsers()

  if (userError) {
    return res.status(500).json({ error: 'Error obteniendo usuarios de Supabase Auth' })
  }

  const supabaseUser = userAuthData.users.find(
    u => u.email === usuario.correo
  )

  if (!supabaseUser) {
    return res.status(404).json({ error: 'Usuario en Auth no encontrado' })
  }
  //fin

  // Generar token de acceso válido como si fuera login normal
  const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: usuario.correo,
  })

  if (tokenError || !tokenData) {
    return res.status(500).json({ error: 'No se pudo generar token de acceso' })
  }

  // Extraer token desde el link (esto puede cambiar, ver nota al final)
  const token = new URL(tokenData.properties.action_link).searchParams.get('token')

  console.log("TOKEN GENERADO:", token)


  //const fakeToken = `facial-${Math.random().toString(36).substr(2)}`

  return res.json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      id_rol: usuario.id_rol
    }
  })
}
