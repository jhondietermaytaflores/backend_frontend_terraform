function CardHabitacion({ habitacion, onReservar }) {
    return (
        <div
            className={`rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all transform duration-300 ease-in-out 
                        ${habitacion.estado !== 'libre' ? 'opacity-60' : 'hover:scale-105 hover:shadow-xl'}`}
            role="article"
            aria-labelledby={`habitacion-${habitacion.numero}`}
        >
            {/* Encabezado con el estado y el número de habitación */}
            <div className="bg-gradient-to-r from-green-500 to-blue-900 text-white px-6 py-3 flex justify-between items-center">
                <span className="font-semibold text-lg">Hab. #{habitacion.numero}</span>
                <span className="text-xs uppercase tracking-widest">{habitacion.estado}</span>
            </div>

            {/* Cuerpo con los detalles de la habitación */}
            <div className="p-6 space-y-4 text-sm text-gray-800">
                <p><strong className="text-indigo-600">Descripción:</strong> {habitacion.descripcion}</p>
                <p><strong className="text-indigo-600">Precio:</strong> Bs {habitacion.precio}</p>
                <p><strong className="text-indigo-600">Piso:</strong> {habitacion.pisos?.nombre_piso || 'No especificado'}</p>
                <p><strong className="text-indigo-600">Categoría:</strong> {habitacion.categorias_habitacion?.nombre_categoria || 'No especificada'}</p>
            </div>

            {/* Botón de reserva */}
            <div className="p-6">
                {habitacion.estado === 'libre' ? (
                    <button
                        onClick={() => onReservar(habitacion)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition transform duration-300 ease-in-out
                                    focus:outline-none focus:ring-4 focus:ring-green-300 hover:scale-105"
                        aria-label={`Reservar habitación ${habitacion.numero}`}
                    >
                        <span className="font-semibold">Reservar Ahora</span>
                    </button>
                ) : (
                    <span className="w-full text-center text-gray-400 py-3">Habitación no disponible</span>
                )}
            </div>
        </div>
    );
}

export default CardHabitacion;
