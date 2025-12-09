// backend/src/middlewares/authMiddleware.js
import { supabase } from '../config/supabase.js'

// para verificar middleware básico que extrae el Bearer token y llama a supabase.auth.getUser(token). Verifica el token y agrega req.usuario = { id, email }.
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token' })
    }
    const token = authHeader.split(' ')[1]
    // Verificar token con Supabase: 
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
        return res.status(401).json({ error: 'Token inválido' })
    }
    req.usuario = { id: user.id, email: user.email }
    next()
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // authData.session.access_token es el token JWT
    const access_token = authData.session.access_token;

    // Obtener usuario de tabla usuarios
    const { data: usuariosData, error: errUsuarios } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', email);
    if (errUsuarios || usuariosData.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuarioRow = usuariosData[0];

    // Buscar id_cliente en tabla clientes si rol=3
    let id_cliente = null;
    if (usuarioRow.id_rol === 3) {
        const { data: cliRow, error: errCli } = await supabase
            .from('clientes')
            .select('id_cliente')
            .eq('id_usuario', usuarioRow.id)
            .single();
        if (!errCli && cliRow) id_cliente = cliRow.id_cliente;
    }

    return res.json({
        token: access_token,
        usuario: {
            id: usuarioRow.id,
            id_cliente,      // nulo si no es cliente
            nombre: usuarioRow.nombre,
            correo: usuarioRow.correo,
            telefono: usuarioRow.telefono,
            id_rol: usuarioRow.id_rol
        }
    });
}

/* export const login = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Obtener usuario de tabla usuarios
    const { data: usuariosData, error: errUsuarios } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', email);
    if (errUsuarios || usuariosData.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const usuarioRow = usuariosData[0];

    // Buscar id_cliente en tabla clientes (puede ser null si no es cliente)
    let id_cliente = null;
    if (usuarioRow.id_rol === 3) {
        const { data: cliRow, error: errCli } = await supabase
            .from('clientes')
            .select('id_cliente')
            .eq('id_usuario', usuarioRow.id)
            .single();
        if (!errCli && cliRow) id_cliente = cliRow.id_cliente;
    }

    return res.json({
        token: data.session.access_token,
        usuario: {
            id: usuarioRow.id,
            id_cliente,      // si es cliente, tendrá valor; si no, null
            nombre: usuarioRow.nombre,
            correo: usuarioRow.correo,
            telefono: usuarioRow.telefono,
            id_rol: usuarioRow.id_rol
        }
    });
}; */
