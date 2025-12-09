import { supabase } from '../config/supabase.js'


export const crearPedido = async (req, res) => {
  const { usuario_id, cliente_id, productos, metodo_pago, tipo_comprobante } = req.body

  const total = productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0)

  const { data: pedido, error: errPedido } = await supabase
    .from('pedidos')
    .insert([{
      usuario_id,
      cliente_id,
      total,
      estado: 'pendiente',
      metodo_pago,
      tipo_comprobante
    }])
    .select()
    .single()

  if (errPedido) return res.status(400).json({ error: errPedido.message })

  const detalles = productos.map(p => ({
    pedido_id: pedido.id_pedido,
    producto_id: p.producto_id,
    cantidad: p.cantidad,
    precio_unitario: p.precio_unitario
  }))

  const { error: errDetalle } = await supabase.from('detalle_pedido').insert(detalles)

  if (errDetalle) return res.status(400).json({ error: errDetalle.message })

  res.json({ message: 'Pedido registrado', pedido })
}
/* 
export const listarPedidos = async (req, res) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      detalle_pedido(
        cantidad,
        precio_unitario,
        producto_id,
        productos (
          nombre,
          imagen_url
        )
      )
    `)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
 */

/* export const listarPedidos = async (req, res) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      total,
      estado,
      fecha_pedido,
      usuario:usuarios (
        id,
        nombre,
        correo
      ),
      cliente:clientes (
        id_cliente,
        nombre,
        apellido,
        correo
      ),
      detalle_pedido (
        cantidad,
        precio_unitario,
        productos (
          nombre,
          imagen_url
        )
      )
    `)
    .order('fecha_pedido', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
} */

export const listarPedidos = async (req, res) => {
  // SELECT puro, sin comentarios ni “//”
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      usuario_id,
      cliente_id,
      total,
      estado,
      fecha_pedido,
      clientes:cliente_id (
        id_cliente,
        nombres,
        apellidos,
        correo
      )
    `)
    .order('fecha_pedido', { ascending: false })

  if (error) {
    console.error('Error al listar pedidos:', error)
    return res.status(500).json({ error: error.message })
  }

  // Mapeamos para enviar al front un campo "clienteNombre"
  const pedidos = data.map(p => ({
    id_pedido:    p.id_pedido,
    total:        p.total,
    estado:       p.estado,
    fecha_pedido: p.fecha_pedido,
    cliente_id:   p.cliente_id,
    // Concatenamos nombres + apellidos
    clienteNombre: p.clientes
      ? `${p.clientes.nombres} ${p.clientes.apellidos}`
      : '—',
    // Opcional: si quieres compatibilidad con antiguo p.cliente.nombre
    cliente: p.clientes
      ? { nombre: `${p.clientes.nombres} ${p.clientes.apellidos}`, correo: p.clientes.correo }
      : null
  }))

  return res.json(pedidos)
}

//seg

/* export const obtenerPedidoPorId = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      detalle_pedido(
        cantidad,
        precio_unitario,
        producto_id,
        productos (
          nombre,
          imagen_url
        )
      )
    `)
    .eq('id_pedido', id)
    .single()

  if (error) return res.status(404).json({ error: 'Pedido no encontrado' })
  res.json(data)
} */

export const obtenerPedidoPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      total,
      estado,
      fecha_pedido,
      metodo_pago,
      tipo_comprobante,
      usuario:usuarios (
        id,
        nombre,
        correo
      ),
      cliente:clientes (
        id_cliente,
        nombre,
        apellido,
        correo
      ),
      detalle_pedido (
        cantidad,
        precio_unitario,
        productos (
          nombre,
          imagen_url,
          descripcion
        )
      )
    `)
    .eq('id_pedido', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json(data);
};

export const actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario_id, observaciones } = req.body; 
  // usuario_id: pasar desde el frontend o extraer del JWT
  // 1) obtener estado anterior
  const { data: pedidoActual, error: err0 } = await supabase
    .from('pedidos')
    .select('estado')
    .eq('id_pedido', id)
    .single();
  if (err0 || !pedidoActual) return res.status(404).json({ error: 'Pedido no encontrado' });
  const estadoAnterior = pedidoActual.estado;
  // 2) actualizar pedido
  const { error: err1 } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id_pedido', id);
  if (err1) return res.status(400).json({ error: err1.message });
  // 3) insertar historial
  const { error: err2 } = await supabase
    .from('historial_pedidos')
    .insert([{
      pedido_id: id,
      usuario_id, 
      estado_anterior: estadoAnterior,
      estado_nuevo: estado,
      observaciones: observaciones || null
    }]);
  if (err2) console.error('Error al guardar historial:', err2);
  res.json({ mensaje: 'Estado actualizado' });
};


export const actualizarPedido = async (req, res) => {
  const { id } = req.params
  const { estado, metodo_pago, tipo_comprobante } = req.body

  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado, metodo_pago, tipo_comprobante })
    .eq('id_pedido', id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

export const eliminarPedido = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id_pedido', id)

  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Pedido eliminado' })
}


/* export const actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  const { error } = await supabase.from('pedidos').update({ estado }).eq('id_pedido', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Estado actualizado' })
} */






/* export const listarPedidos = async (req, res) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`*, detalle_pedido(*, productos(nombre, imagen_url))`)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
} */

/* export const crearPedido = async (req, res) => {
  const { usuario_id, cliente_id, productos, metodo_pago, tipo_comprobante } = req.body

  const total = productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0)

  const { data: pedido, error: errPedido } = await supabase.from('pedidos').insert([{
    usuario_id, cliente_id, total, estado: 'pendiente', metodo_pago, tipo_comprobante
  }]).select().single()

  if (errPedido) return res.status(400).json({ error: errPedido.message })

  const detalles = productos.map(p => ({
    pedido_id: pedido.id_pedido,
    producto_id: p.producto_id,
    cantidad: p.cantidad,
    precio_unitario: p.precio_unitario
  }))
  await supabase.from('detalle_pedido').insert(detalles)

  res.json({ mensaje: 'Pedido registrado', pedido })
} */