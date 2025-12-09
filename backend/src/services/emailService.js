import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const enviarCredenciales = async (to, nombre, contrasena, rol = 'usuario') => {
    const esEmpleado = rol !== 'cliente'

    const mailOptions = {
        from: `"Hotel Las Nutrias" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Credenciales de acceso - Hotel Las Nutrias (${esEmpleado ? 'Empleado' : 'Cliente'})`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px;">
        <h2 style="text-align: center; color: #0069d9;">${esEmpleado ? '👔 Acceso del Empleado' : '🦦 Bienvenido al Hotel Las Nutrias'}</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>${esEmpleado
                ? 'Tu cuenta de empleado ha sido creada correctamente.'
                : 'Tu cuenta de cliente ha sido creada exitosamente.'
            }</p>

        <table style="margin-top: 20px; border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Correo</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Contraseña</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${contrasena}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Rol</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${rol}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Puedes iniciar sesión desde nuestra plataforma web:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173" style="background: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Ir a la plataforma</a>
        </div>

        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #555;">Este mensaje fue enviado automáticamente. No respondas a este correo.</p>
        <p style="font-size: 12px; color: #555;">Hotel Las Nutrias - Todos los derechos reservados.</p>
      </div>
    `
    }
    

    return transporter.sendMail(mailOptions)
}

//ya Funcionaba
    /* export const enviarCredenciales = async (to, nombre, contrasena) => {
        const mailOptions = {
            from: `"Hotel Las Nutrias" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Bienvenido a Hotel Las Nutrias 🦦 - Tus credenciales',
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px;">
            <h2 style="text-align: center; color: #0069d9;">🌊 Bienvenido al Hotel Las Nutrias 🦦</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente. A continuación te compartimos tus credenciales para ingresar al sistema:</p>
            
            <table style="margin-top: 20px; border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Correo</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${to}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Contraseña</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${contrasena}</td>
              </tr>
            </table>
    
            <p style="margin-top: 20px;">Puedes iniciar sesión desde nuestra plataforma web. Te recomendamos cambiar tu contraseña después del primer ingreso.</p>
    
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" style="background: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Ir a la plataforma</a>
            </div>
    
            <hr style="margin-top: 30px;">
            <p style="font-size: 12px; color: #555;">Este correo fue enviado automáticamente. No respondas a este mensaje.</p>
            <p style="font-size: 12px; color: #555;">Hotel Las Nutrias - Todos los derechos reservados.</p>
          </div>
        `
        } */