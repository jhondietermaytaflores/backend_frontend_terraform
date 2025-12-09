import { supabase } from '../config/supabase.js'
import { registrarUsuarioAuth } from '../utils/registrarEnAuth.js'
import { enviarCredenciales } from '../services/emailService.js'

export const buscarClientes = async (req, res) => {
    const { q } = req.query
    const { data, error } = await supabase
        .from('clientes')
        .select('id_cliente, nombres, apellidos, correo,*')

        .or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%,ci.ilike.%${q}%`)
    //.ilike('nombres', `%${q}%,apellidos.ilike.%${q}%,ci.ilike.%${q}%`) // búsqueda parcial
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

// 1. Crear Cliente y su Usuario asociado
export const crearCliente = async (req, res) => {
    try {
        const { nombres, apellidos, ci, complemento_ci, telefono, correo, contrasena } = req.body

        // Validar si ya existe cliente con ese CI
        const { data: clienteExistente } = await supabase
            .from('clientes')
            .select('id_cliente')
            .eq('ci', ci)
            .maybeSingle()

        if (clienteExistente) {
            return res.status(400).json({ error: 'Ya existe un cliente con ese CI' })
        }

        // Generar contraseña por defecto si no se proporciona
        const passwordFinal = contrasena?.trim() ? contrasena : `${ci}nutrias`
        // Crear usuario en Supabase Auth
        const auth_id = await registrarUsuarioAuth(correo, passwordFinal)

        console.log('🧪 Intentando crear usuario...')
        // Crear usuario
        const { data: nuevoUsuario, error: errorUsuario } = await supabase
            .from('usuarios')
            .insert([{
                nombre: `${nombres} ${apellidos}`,
                correo,
                telefono,                
                id_rol: 3,   // Asignar rol de cliente (3)             
                auth_id, // Guardamos el ID de auth.users
                contrasena: null, // No guardamos la contraseña aquí, solo en auth.users
            }])
            .select('id')
            .single()

        if (errorUsuario) {
            console.error('❌ Error al crear usuario:', errorUsuario)
            return res.status(500).json({ error: 'Error al crear el usuario' })
        }

        
        const payloadCliente = {
            nombres,
            apellidos,
            ci,
            complemento_ci,
            telefono,
            correo,
            id_usuario: nuevoUsuario.id,
        }

        console.log('[👀 Payload recibido en crearCliente]', payloadCliente)

        const { data, error } = await supabase
            .from('clientes')
            .insert([payloadCliente])
            .select()
            .single()

        
        if (error) {
            console.error('❌ Error al crear cliente:', error)
            return res.status(400).json({ error: error.message })
        }


        // Enviar credenciales por correo
        try {
            console.log('📤 Enviando correo...')
            await enviarCredenciales(correo, `${nombres} ${apellidos}`, passwordFinal, 'cliente')
            console.log('📤 Correo enviado correctamente a:', correo)
        } catch (correoError) {
            console.error('⚠️ Error al enviar email:', correoError.message)
        }

        /* res.json({ cliente: nuevoCliente, usuario: nuevoUsuario }) */
        res.json({ cliente: data, usuario: nuevoUsuario })

        
    } catch (e) {
        console.error('💥 Error inesperado en crearCliente:', e)
        res.status(500).json({ error: 'Error inesperado del servidor' })
    }
}



export const listarClientes = async (req, res) => {
    const { data, error } = await supabase.from('clientes').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}
export const obtenerClientePorId = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('clientes').select('*').eq('id_cliente', id).single()
    if (error) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(data)
}
export const actualizarCliente = async (req, res) => {
    const { id } = req.params
    const { nombres, apellidos, ci, complemento_ci, telefono, correo } = req.body
    const { data, error } = await supabase
        .from('clientes')
        .update({ nombres, apellidos, ci, complemento_ci, telefono, correo })
        .eq('id_cliente', id)
        .select()
        .single()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
}
/* export const eliminarCliente = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('clientes').delete().eq('id_cliente', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ mensaje: 'Cliente eliminado' })
} */

// 2. Eliminar Cliente + su Usuario relacionado
export const eliminarCliente = async (req, res) => {
    const { id } = req.params

    const { data: cliente } = await supabase
        .from('clientes')
        .select('id_usuario')
        .eq('id_cliente', id)
        .single()

    // Eliminar el cliente
    const { error: errorCliente } = await supabase
        .from('clientes')
        .delete()
        .eq('id_cliente', id)

    if (errorCliente) return res.status(400).json({ error: errorCliente.message })

    // Si tiene usuario vinculado, eliminarlo también
    if (cliente?.id_usuario) {
        await supabase.from('usuarios').delete().eq('id', cliente.id_usuario)
    }

    res.json({ mensaje: 'Cliente y usuario eliminado correctamente' })
}



export const obtenerClientesPorReserva = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase
        .from('reservas')
        .select('clientes(id_cliente, nombres, apellidos, correo)')
        .eq('id_reserva', id)
        .single()

    if (error) return res.status(404).json({ error: 'Reserva no encontrada' })

    if (!data.clientes) return res.status(404).json({ error: 'Cliente no encontrado para esta reserva' })

    res.json(data.clientes)
}

export const obtenerHistorialCliente = async (req, res) => {
    const { id } = req.params

    const [reservas, pedidos] = await Promise.all([
        supabase
            .from('reservas')
            .select('id, fecha_entrada, fecha_salida, estado, habitaciones(numero)')
            .eq('cliente_id', id),
        supabase
            .from('pedidos')
            .select('id_pedido, total, estado, fecha_pedido')
            .eq('cliente_id', id),
    ])

    if (reservas.error || pedidos.error) {
        return res.status(500).json({ error: 'Error al cargar historial' })
    }

    res.json({
        reservas: reservas.data,
        pedidos: pedidos.data,
    })
}


export const obtenerReservasPorCliente = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('id_cliente', id)
        .order('fecha_inicio', { ascending: false })

    if (error) return res.status(404).json({ error: 'Reservas no encontradas por Cliente' })

    res.json(data)
}