import { useState, useEffect } from 'react'

function ModalCliente({ visible, onClose, onSubmit, clienteEdit }) {
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        ci: '',
        complemento_ci: ''
    })

    /* useEffect(() => {
        if (clienteEdit) setForm(clienteEdit)
    }, [clienteEdit]) */

    useEffect(() => {
        if (clienteEdit) {
            setForm({
                nombres: clienteEdit.nombres || '',
                apellidos: clienteEdit.apellidos || '',
                correo: clienteEdit.correo || '',
                telefono: clienteEdit.telefono || '',
                ci: clienteEdit.ci || '',
                complemento_ci: clienteEdit.complemento_ci || ''
            })
        }
    }, [clienteEdit])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form)
    }

    if (!visible) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{clienteEdit ? 'Editar' : 'Nuevo'} Cliente</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" className="border p-2 w-full rounded" required />
                    <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" className="border p-2 w-full rounded" required />
                    <input name="ci" value={form.ci} onChange={handleChange} placeholder="CI" className="border p-2 w-full rounded" required />
                    <input name="complemento_ci" value={form.complemento_ci} onChange={handleChange} placeholder="Complemento CI" className="border p-2 w-full rounded" />
                    <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 w-full rounded" required />
                    <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="border p-2 w-full rounded" required />

                    <input
                        name="contrasena"
                        type="password"
                        value={form.contrasena || ''}
                        onChange={handleChange}
                        placeholder="Contraseña (opcional, te llegara un correo con la contraseña por defecto, puedes cambiarla luego)"
                        className="border p-2 w-full rounded"
                    />


                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{clienteEdit ? 'Actualizar' : 'Crear'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalCliente
