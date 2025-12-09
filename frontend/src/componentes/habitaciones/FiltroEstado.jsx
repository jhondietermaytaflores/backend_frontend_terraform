function FiltroEstado({ estadoSeleccionado, onChange }) {
    return (
        <select
            value={estadoSeleccionado}
            onChange={(e) => onChange(e.target.value)}
            className="border p-2 rounded text-sm  dark:text-white bg-white dark:bg-gray-800"
        >
            <option value="">Todos los estados</option>
            <option value="libre">Libre</option>
            <option value="ocupada">Ocupada</option>
            <option value="limpieza">Limpieza</option>
            <option value="mantenimiento">Mantenimiento</option>
        </select>
    )
}

export default FiltroEstado
