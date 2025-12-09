import { supabase } from '../config/supabase.js'

export const crearReserva = async (req, res) => {
  const { cliente_id, habitacion_id, fecha_entrada, fecha_salida, observaciones } = req.body

  const { data, error } = await supabase
    .from('reservas')
    .insert([{
      cliente_id,
      habitacion_id,
      fecha_entrada,
      fecha_salida,
      estado: 'reservado',
      observaciones
    }])

  if (error) return res.status(400).json({ error: error.message })

  // Marcar habitación como ocupada
  await supabase
    .from('habitaciones')
    .update({ estado: 'ocupada' })
    .eq('id_habitacion', habitacion_id)

  // al final de crearReserva
  await supabase.from('notificaciones').insert([{
    usuario_id: req.usuario.id, // ← quien reservó (requieres auth middleware)
    reserva_id: reservaInsertada.id,
    mensaje: `Reserva realizada para el cliente ${cliente_nombre} en habitación #${numero_habitacion}`,
  }])


  res.json({ message: 'Reserva creada correctamente', reserva: data })
}

/* export const listarReservas = async (req, res) => {
  const { data, error } = await supabase.from('reservas').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}


export const actualizarEstado = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  const { error } = await supabase.from('reservas').update({ estado }).eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Reserva actualizada' })
} */

//seg

export const obtenerReservaPorId = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase.from('reservas').select('*').eq('id_reserva', id).single()
  if (error) return res.status(404).json({ error: 'Reserva no encontrada' })
  res.json(data)
}
export const actualizarReserva = async (req, res) => {
  const { id } = req.params
  const { cliente_id, habitacion_id, fecha_entrada, fecha_salida, observaciones } = req.body

  const { data, error } = await supabase
    .from('reservas')
    .update({
      cliente_id,
      habitacion_id,
      fecha_entrada,
      fecha_salida,
      observaciones
    })
    .eq('id_reserva', id)

  if (error) return res.status(400).json({ error: error.message })

  // Actualizar estado de la habitación si se cambió
  if (habitacion_id) {
    await supabase
      .from('habitaciones')
      .update({ estado: 'ocupada' })
      .eq('id_habitacion', habitacion_id)
  }

  res.json({ message: 'Reserva actualizada correctamente', reserva: data })
}
export const eliminarReserva = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('reservas').delete().eq('id_reserva', id)
  if (error) return res.status(400).json({ error: error.message })

  // Marcar habitación como libre
  await supabase
    .from('habitaciones')
    .update({ estado: 'libre' })
    .eq('id_habitacion', id)

  res.json({ message: 'Reserva eliminada correctamente' })
}



/* export const obtenerReservasPorCliente = async (req, res) => {
  const { id } = req.params
  // Usar columna cliente_id en la condición
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      id, 
      cliente_id, 
      habitacion_id, 
      fecha_entrada, 
      fecha_salida, 
      estado, 
      observaciones,
      creado_en,
      habitaciones (
        id_habitacion,
        numero
      ),
      clientes:cliente_id (
        id_cliente,
        nombres,
        apellidos,
        correo
        )
    `)
    .eq('cliente_id', id)
    .order('fecha_entrada', { ascending: false })

  if (error) {
    console.error('Error al obtener reservas por cliente:', error)
    return res.status(500).json({ error: error.message })
  }
  return res.json(data)
} */

export const obtenerReservasPorCliente = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    // Buscar id_cliente
    const { data: clienteRow, error: errClienteRow } = await supabase
      .from('clientes')
      .select('id_cliente')
      .eq('id_usuario', usuarioId)
      .single();
    if (errClienteRow || !clienteRow) {
      return res.status(400).json({ error: 'Perfil de cliente no encontrado.' });
    }
    const id_cliente = clienteRow.id_cliente;

    // Obtener reservas del cliente con joins
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        id, 
        cliente_id, 
        habitacion_id, 
        fecha_entrada, 
        fecha_salida, 
        estado, 
        observaciones,
        creado_en,
        habitaciones (
          id_habitacion,
          numero
        )
      `)
      .eq('cliente_id', id_cliente)
      .order('fecha_entrada', { ascending: false });
    if (error) {
      console.error('Error al obtener reservas por cliente:', error);
      return res.status(500).json({ error: error.message });
    }
    // Transformar si necesitas
    const resultado = data.map(r => ({
      id_reserva: r.id,
      cliente_id: r.cliente_id,
      habitacion_id: r.habitacion_id,
      fecha_entrada: r.fecha_entrada,
      fecha_salida: r.fecha_salida,
      estado: r.estado,
      observaciones: r.observaciones,
      creado_en: r.creado_en,
      habitacion: r.habitaciones ? { numero: r.habitaciones.numero } : null
    }));
    return res.json(resultado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno al obtener reservas' });
  }
}

// Listar todas las reservas (para recepcionista/admin), con joins para mostrar cliente y habitación
export const listarReservas = async (req, res) => {
  // Ajustar select para traer datos relacionados
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      id, 
      cliente_id, 
      habitacion_id,
      fecha_entrada, 
      fecha_salida, 
      estado,
      observaciones,
      creado_en,
      clientes:cliente_id (
        id_cliente,
        nombres,
        apellidos
      ),
      habitaciones (
        id_habitacion,
        numero
      )
    `)
    .order('fecha_entrada', { ascending: false })

  if (error) {
    console.error('Error al listar reservas:', error)
    return res.status(500).json({ error: error.message })
  }
  // Transformar para frontend: puede renombrar cliente a usuario
  const resultado = data.map(r => ({
    id_reserva: r.id,
    cliente_id: r.cliente_id,
    habitacion_id: r.habitacion_id,
    fecha_entrada: r.fecha_entrada,
    fecha_salida: r.fecha_salida,
    estado: r.estado,
    observaciones: r.observaciones,
    creado_en: r.creado_en,
    // Propiedad para mostrar nombre de cliente:
    cliente: r.clientes ? `${r.clientes.nombres} ${r.clientes.apellidos}` : null,
    // Para compatibilidad con tus componentes que usaban r.usuario.nombre:
    usuario: r.clientes ? { nombre: `${r.clientes.nombres} ${r.clientes.apellidos}` } : null,
    // Habitación:
    habitacion: r.habitaciones ? { numero: r.habitaciones.numero } : null
  }))
  return res.json(resultado)
}

// Actualizar estado de reserva
export const actualizarEstado = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  const { data, error } = await supabase
    .from('reservas')
    .update({ estado })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar estado de reserva:', error)
    return res.status(400).json({ error: error.message })
  }
  return res.json({ mensaje: 'Reserva actualizada', reserva: data })
}

//crear reserva desde view cliente
export const crearReserva_deCliente = async (req, res) => {
  try {
    // 1) usuario autenticado (middleware auth)
    const usuarioId = req.usuario?.id;
    
    if (!usuarioId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const { habitacion_id, fecha_entrada, fecha_salida, observaciones } = req.body;
    if (!habitacion_id || !fecha_entrada || !fecha_salida) {
      return res.status(400).json({ error: 'Faltan datos necesarios para crear la reserva.' });
    }

    // 2) Buscar id_cliente para este usuario
    const { data: clienteRow, error: errClienteRow } = await supabase
      .from('clientes')
      .select('id_cliente')
      .eq('id_usuario', usuarioId)
      .single();
    if (errClienteRow || !clienteRow) {
      console.error('No se encontró cliente relacionado al usuario:', errClienteRow);
      return res.status(400).json({ error: 'Perfil de cliente no encontrado para este usuario.' });
    }
    const id_cliente = clienteRow.id_cliente;

    // 3) Insertar reserva:
    const { data: reserva, error: errorInsert } = await supabase
      .from('reservas')
      .insert([{
        cliente_id: id_cliente,
        habitacion_id,
        fecha_entrada,
        fecha_salida,
        estado: 'reservado',
        observaciones
      }])
      .select()  // para obtener la reserva creada
      .single();
    if (errorInsert) {
      console.error('Error insertando reserva:', errorInsert);
      return res.status(400).json({ error: errorInsert.message });
    }

    // 4) Marcar habitación ocupada
    const { error: errorHab } = await supabase
      .from('habitaciones')
      .update({ estado: 'ocupada' })
      .eq('id_habitacion', habitacion_id);
    if (errorHab) {
      console.error('Error marcando habitación ocupada:', errorHab);
      
    }

    // 5) Insertar notificación
    let cliente_nombre = null;
    // Obtener nombre del usuario desde tabla usuarios
    const { data: usuarioRow, error: errUsuario } = await supabase
      .from('usuarios')
      .select('nombre')
      .eq('id', usuarioId)
      .single();
    if (!errUsuario && usuarioRow) {
      cliente_nombre = usuarioRow.nombre;
    }
    // Obtener número de habitación
    let numero_habitacion = null;
    const { data: habRow, error: errHabRow } = await supabase
      .from('habitaciones')
      .select('numero')
      .eq('id_habitacion', habitacion_id)
      .single();
    if (!errHabRow && habRow) {
      numero_habitacion = habRow.numero;
    }
    // Insertar notificación
    const mensaje = `Reserva realizada para el cliente ${cliente_nombre || id_cliente} en habitación #${numero_habitacion || habitacion_id}`;
    const { error: errNotif } = await supabase.from('notificaciones').insert([{
      usuario_id: usuarioId,     // guardamos id de usuarios.id como quien generó la acción
      reserva_id: reserva.id,     // supabase devuelve 'id' (o id_reserva según tu select)
      mensaje
    }]);
    if (errNotif) {
      console.error('Error insertando notificación:', errNotif);
    }

    return res.json({ message: 'Reserva creada correctamente', reserva });
  } catch (err) {
    console.error('Error inesperado en crearReserva:', err);
    return res.status(500).json({ error: 'Error interno al crear reserva' });
  }
}

/*

try {
    const { cliente_id, habitacion_id, fecha_entrada, fecha_salida, observaciones } = req.body

    if (!cliente_id || !habitacion_id || !fecha_entrada || !fecha_salida) {
      return res.status(400).json({ error: 'Faltan datos necesarios para crear la reserva.' })
    }

    // Insertar reserva y retornar los campos recién creados (select().single())
    const { data: reserva, error: errorInsert } = await supabase
      .from('reservas')
      .insert([{
        cliente_id,
        habitacion_id,
        fecha_entrada,
        fecha_salida,
        estado: 'reservado',
        observaciones
      }])
      .select()  // para obtener los datos insertados
      .single()

    if (errorInsert) {
      console.error('Error insertando reserva:', errorInsert)
      return res.status(400).json({ error: errorInsert.message })
    }

    // Marcar habitación como ocupada
    const { error: errorHab } = await supabase
      .from('habitaciones')
      .update({ estado: 'ocupada' })
      .eq('id_habitacion', habitacion_id)
    if (errorHab) {
      console.error('Error marcando habitación ocupada:', errorHab)
      // no retornamos aún; continuamos para notificar, pero podrías decidir revertir la reserva o informar
    }

    // Para notificaciones: obtenemos nombre de cliente y número de habitación
    let cliente_nombre = null
    let numero_habitacion = null

    // Obtener nombre completo del cliente (suponiendo que en tu tabla usuarios está el nombre)
    const { data: usuarioRow, error: errUsuario } = await supabase
      .from('usuarios')
      .select('nombre')
      .eq('id', cliente_id)
      .single()
    if (!errUsuario && usuarioRow) {
      cliente_nombre = usuarioRow.nombre
    }

    // Obtener número de habitación
    const { data: habRow, error: errHabRow } = await supabase
      .from('habitaciones')
      .select('numero')
      .eq('id_habitacion', habitacion_id)
      .single()
    if (!errHabRow && habRow) {
      numero_habitacion = habRow.numero
    }

    // Insertar notificación: usar cliente_id como usuario que generó la reserva
    const mensaje = `Reserva realizada para el cliente ${cliente_nombre || cliente_id} en habitación #${numero_habitacion || habitacion_id}`
    const { error: errNotif } = await supabase.from('notificaciones').insert([{
      usuario_id: cliente_id,         // quien reservó
      reserva_id: reserva.id,         // id de reserva insertada
      mensaje
    }])
    if (errNotif) {
      console.error('Error insertando notificación:', errNotif)
      // no abortamos la respuesta exitosa, pero lo registramos
    }

    // Responder con la reserva creada
    return res.json({ message: 'Reserva creada correctamente', reserva })
  } catch (err) {
    console.error('Error inesperado en crearReserva:', err)
    return res.status(500).json({ error: 'Error interno al crear reserva' })
  }
    */
