import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { api } from '../../servicios/api'
import dayjs from 'dayjs'

function ModalReservaRapida({ habitacion, onClose }) {
    const [modo, setModo] = useState('registrar')
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        ci: '',
        telefono: '',
        correo: '',
        fecha_entrada: dayjs().format('YYYY-MM-DDTHH:mm'),
        fecha_salida: '',
        comentario: ''
    })

    const [clientes, setClientes] = useState([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            fecha_entrada: dayjs().format('YYYY-MM-DDTHH:mm')
        }))
    }, [])

    const buscarClientes = async (q) => {
        const { data } = await api.get(`/clientes/buscar?q=${q}`)
        setClientes(data)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (e.target.name === 'nombres' && modo === 'existente') {
            buscarClientes(e.target.value)
        }
    }

    const reservar = async (e) => {
        e.preventDefault()
        try {
            let cliente_id

            if (modo === 'registrar') {
                const { data } = await api.post('/clientes', form)
                cliente_id = data.id_cliente
            } else {
                if (!clienteSeleccionado) return Swal.fire('Error', 'Seleccione un cliente', 'error')
                cliente_id = clienteSeleccionado.id_cliente
            }

            await api.post('/reservas', {
                cliente_id,
                habitacion_id: habitacion.id_habitacion,
                fecha_entrada: form.fecha_entrada,
                fecha_salida: form.fecha_salida,
                estado: 'reservado',
                observaciones: form.comentario
            })

            Swal.fire('Éxito', 'Reserva registrada correctamente', 'success')
            onClose()
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'No se pudo completar la reserva', 'error')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Reserva rápida habitación #{habitacion.numero}</h3>

                <form onSubmit={reservar} className="space-y-3 text-sm">
                    <select value={modo} onChange={(e) => setModo(e.target.value)} className="border p-2 rounded w-full">
                        <option value="registrar">Registrar nuevo cliente</option>
                        <option value="existente">Usar cliente existente</option>
                    </select>

                    {modo === 'registrar' ? (
                        <>
                            <input name="nombres" placeholder="Nombres" className="border p-2 w-full" onChange={handleChange} required />
                            <input name="apellidos" placeholder="Apellidos" className="border p-2 w-full" onChange={handleChange} required />
                            <input name="ci" placeholder="CI" className="border p-2 w-full" onChange={handleChange} required />
                            <input name="telefono" placeholder="Teléfono" className="border p-2 w-full" onChange={handleChange} required />
                            <input name="correo" placeholder="Correo" className="border p-2 w-full" onChange={handleChange} />
                        </>
                    ) : (
                        <>
                            <input name="nombres" placeholder="Buscar cliente..." className="border p-2 w-full" onChange={handleChange} />
                            <ul className="max-h-24 overflow-y-auto border rounded text-xs text-left">
                                {clientes.map(c => (
                                    <li key={c.id_cliente}>
                                        <button
                                            type="button"
                                            className={`block w-full p-2 text-left hover:bg-gray-200 ${clienteSeleccionado?.id_cliente === c.id_cliente ? 'bg-blue-100' : ''}`}
                                            onClick={() => setClienteSeleccionado(c)}
                                        >
                                            {c.nombres} {c.apellidos} ({c.correo})
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <label className="block text-sm mt-2">Fecha entrada (automática)</label>
                    <input type="datetime-local" name="fecha_entrada" value={form.fecha_entrada} className="border p-2 w-full" readOnly />

                    <label className="block text-sm">Fecha salida (con hora)</label>
                    <input type="datetime-local" name="fecha_salida" className="border p-2 w-full" onChange={handleChange} required />

                    <textarea name="comentario" placeholder="Comentario (opcional)" onChange={handleChange} className="border p-2 w-full" />

                    <div className="flex justify-between mt-4">
                        <button onClick={onClose} type="button" className="text-red-600 hover:underline">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Reservar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalReservaRapida
