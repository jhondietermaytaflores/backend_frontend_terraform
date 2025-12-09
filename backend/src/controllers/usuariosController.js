import { supabase } from '../config/supabase.js'
//import bcrypt from 'bcrypt'
import { enviarCredenciales } from '../services/emailService.js'
import { registrarUsuarioAuth } from '../utils/registrarEnAuth.js'

export const listarUsuarios = async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, roles(nombre_rol)')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}



//crud

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, id_rol } = req.body

    //validacion si hay correo ya registrado en las tablas de 'usuarios'
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo', correo)
      .maybeSingle()
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo' })
    }
    //validacion si hay correo ya registrado en las tablas de 'auth.users'
    const { data: authUsuarioExistente } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', correo)
      .maybeSingle()
    if (authUsuarioExistente) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo en el sistema de autenticación' })
    }

    // Validación básica
    if (!nombre || !correo || !telefono || !id_rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    // Contraseña por defecto si no viene
    const passwordFinal = contrasena?.trim() ? contrasena : `${telefono}nutrias`

    // 1. Crear usuario en auth.users
    const auth_id = await registrarUsuarioAuth(correo, passwordFinal)


    //const hashed = await bcrypt.hash(passwordFinal, 10)

    const { data, error } = await supabase.from('usuarios').insert([{
      nombre,
      correo,
      telefono,
      contrasena: null, //CAMBIADO: no guardamos la contraseña en la tabla 'usuarios',porque lo guardaremos en auth.users
      id_rol,
      auth_id //  CAMBIADO: ahora guardamos el auth_id
    }]).select('id, id_rol').single() //agregamos select para obtener el id_rol para el JOIN posterior

    if (error) {
      console.error('❌ Error al crear usuario:', error)
      return res.status(500).json({ error: 'No se pudo crear el usuario' })
    }

    // Aquí realizamos el 'JOIN' para obtener el nombre del rol junto con los datos del usuario
    const { data: usuarioConRol, error: rolError } = await supabase
      .from('roles')
      .select('nombre_rol')
      .eq('id_rol', data.id_rol)  // Usamos el id_rol que obtuvimos al insertar el usuario
      .maybeSingle();

    if (rolError) {
      console.error('❌ Error al obtener el nombre del rol:', rolError);
      return res.status(500).json({ error: 'No se pudo obtener el nombre del rol' });
    }
    const rolNombre = usuarioConRol?.nombre_rol || 'usuario desc'; // Si no hay rol, usaremos esto como valor por defecto

    // Enviar correo
    try {
      console.log('📧 Enviando correo...')
      //await enviarCredenciales(correo, nombre, passwordFinal, 'empleado')
      await enviarCredenciales(correo, nombre, passwordFinal, rolNombre);
      console.log(`📩 Email enviado a ${correo}`)
    } catch (e) {
      console.error('⚠️ Error al enviar correo:', e.message)
    }

    res.json({ mensaje: 'Empleado creado correctamente', usuario: data })
  } catch (err) {
    console.error('💥 Error inesperado:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params
  const { nombre, correo, contrasena, telefono, id_rol } = req.body

  const { data, error } = await supabase.from('usuarios').update({
    nombre,
    correo,
    contrasena,
    telefono,
    id_rol
  }).eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}
/* 
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id) // 👈 CAMBIADO: era 'id_usuario'

  if (error) return res.status(400).json({ error: error.message })

  res.json({ mensaje: 'Usuario eliminado' })
} */

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obtener auth_id del usuario que vamos a eliminar
    const { data: usuario, error: fetchError } = await supabase
      .from('usuarios')
      .select('auth_id')
      .eq('id', id)
      .single();

    if (fetchError || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { auth_id } = usuario;

    // 2. Eliminar usuario en Supabase Auth (auth.users)
    if (auth_id) {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(auth_id);
      if (deleteAuthError) {
        console.warn('⚠️ No se pudo eliminar el usuario en auth:', deleteAuthError.message);
        // Puedes decidir si esto debe detener el proceso o no
      }
    }

    // 3. Eliminar de la tabla local 'usuarios'
    const { error: deleteError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('💥 Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('usuarios')
    .select('*, roles(nombre_rol)')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Usuario no encontrado' })
  res.json(data)
}




// POST /api/usuarios/:id/descriptor
export const guardarDescriptor = async (req, res) => {
  const { id } = req.params
  const { descriptor } = req.body  // array de floats length 128

  console.log('ID recibido:', id)
  console.log('Descriptor recibido (primeros 5):', descriptor?.slice?.(0, 5))
  try {
    // Aquí usas tu Supabase o tu ORM para actualizar la tabla:
    // UPDATE usuarios SET face_descriptor = descriptor WHERE id = id
    //await supabase
    const { data, error } = await supabase  
      .from('usuarios')
      .update({ face_descriptor: descriptor })
      .eq('id', id)
      .select()

    if (error) throw error
    if (data.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.log('Descriptor guardado correctamente para el usuario con ID:', id)

    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'No se pudo guardar descriptor' })
  }
}


export const getUsuariosConDescriptor = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, face_descriptor')

    if (error) throw error

    return res.json(data)
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    return res.status(500).json({ error: 'Error al obtener usuarios con descriptores' })
  }
}

// filtrar empleados
export const obtenerEmpleados = async (req, res) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
            *,
            rol:roles (
                nombre_rol
            )
        `)
        .neq('id_rol', 3) // excluir clientes

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}