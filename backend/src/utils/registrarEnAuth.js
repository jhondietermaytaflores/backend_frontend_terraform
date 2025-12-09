import { supabase } from '../config/supabase.js'

export const registrarUsuarioAuth = async (email, password) => {
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true  // si quieres omitir verificación
    })

    if (error) {
        throw new Error(error.message)
    }

    return data?.user?.id
}
