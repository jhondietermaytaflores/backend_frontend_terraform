import { Link } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'
import { useTheme } from '../context/ThemeContext';

function Sidebar() {
  const [hoverHabitaciones, setHoverHabitaciones] = useState(false)
  const [hoverInventario, setHoverInventario] = useState(false)

  const [hoverUsuarios, setHoverUsuarios] = useState(false)

  const [hoverTareas, setHoverTareas] = useState(false)
  const { theme } = useTheme();

  const bgBase = theme === 'light' ? 'bg-[#113c07] text-[#DBFF5E]' : 'bg-verdeOscuro-900 text-gray-200 ';
  const hoverUnderline = 'hover:underline';

  return (
    <div dir='rtl' className='border-r-4 border-s-green-500 flex h-screen dark:bg-[#141414] !'>

      


      <aside dir='ltr' className={clsx("w-64 flex flex-col p-4", bgBase)}>
        <div className="imagen w-30 h-auto ">
        <img
          src="/src/assets/logooficial.png"
          alt="Decoración"
          className="w-full h-full object-cover"
        />
      </div>
        <h2 className="text-2xl font-bold mb-6">Administrador</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/admin" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Inicio</Link>


          <div
            onMouseEnter={() => setHoverHabitaciones(true)}
            onMouseLeave={() => setHoverHabitaciones(false)}
            className="relative"
          >
            <div className={clsx("flex items-center justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>
              <span>Habitaciones y Catalogo</span>
              <span>{hoverHabitaciones ? '▴' : '▾'}</span>
            </div>
            <div
              className={clsx(
                "ml-4 mt-1 flex flex-col gap-2 text-sm overflow-hidden transition-all duration-300",
                hoverHabitaciones ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Link to="/admin/habitaciones" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Gestion de Habitaciones</Link>

              <Link to="/admin/catalogo-habitaciones" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Catálogo de Habitaciones</Link>

            </div>
          </div>


          <Link to="/admin/reservas" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Reservas</Link>
          <Link to="/admin/pedidos" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Pedidos</Link>
          <Link to="/admin/productos" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Productos</Link>

          {/* Submenú Usuarios */}
          <div
            onMouseEnter={() => setHoverUsuarios(true)}
            onMouseLeave={() => setHoverUsuarios(false)}
            className="relative"
          >
            <div className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>
              <span>Usuarios</span>
              <span>{hoverUsuarios ? '▴' : '▾'}</span>
            </div>
            <div
              className={clsx(
                "ml-4 mt-1 flex flex-col gap-2 text-sm overflow-hidden transition-all duration-300",
                hoverUsuarios ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Link to="/admin/usuarios-clientes" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Gestion de Clientes</Link>
              <Link to="/admin/usuarios-empleados" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Gestion de Empleados</Link>
            </div>
          </div>

          <div
            onMouseEnter={() => setHoverInventario(true)}
            onMouseLeave={() => setHoverInventario(false)}
            className="relative"
          >
            <div className={clsx("flex items-center justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>
              <span>Inventarios y Asignaciones</span>
              <span>{hoverInventario ? '▴' : '▾'}</span>
            </div>

            {/* Submenú animado */}
            <div
              className={clsx(
                "ml-4 mt-1 flex flex-col gap-2 text-sm overflow-hidden transition-all duration-300",
                hoverInventario ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Link to="/admin/inventario" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Inventario General</Link>
              <Link to="/admin/inventarioHabitacion" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Asignaciones Por Habitación</Link>
              <Link to="/admin/inventarioSector" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Asignaciones Por Sector</Link>
            </div>
          </div>

          {/* Submenú gestion de tareas */}
          <div
            onMouseEnter={() => setHoverTareas(true)}
            onMouseLeave={() => setHoverTareas(false)}
            className="relative"
          >
            <div className={clsx("flex items-center justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>
              <span>Gestion de Tareas</span>
              <span>{hoverTareas ? '▴' : '▾'}</span>
            </div>
            <div
              className={clsx(
                "ml-4 mt-1 flex flex-col gap-2 text-sm overflow-hidden transition-all duration-300",
                hoverTareas ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Link to="/tipos-tarea" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Gestion de Tareas</Link>
              <Link to="/asignaciones" className={clsx(" justify-between cursor-pointer hover:decoration-green-600 ", hoverUnderline)}>Gestion de Asignaciones</Link>
            </div>
          </div>

          <Link to="/" className={clsx("text-red-300 mt-6 justify-between cursor-pointer hover:decoration-red-600 ", hoverUnderline)}>Cerrar sesión</Link>
        </nav>
      </aside>
    </div>
  )
}

export default Sidebar
