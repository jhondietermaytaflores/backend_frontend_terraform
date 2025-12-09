import Sidebar from './Sidebar'
import Header from './Header'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'

function DashboardLayout({ children }) {
    const { usuario, logout } = useAuth()

    const {theme} = useTheme()

    // Fondos dinámicos:
  const bgContainer = theme === 'light' ? 'bg-[#DBFF5E] text-[#113c07]' : 'bg-gray-900 text-gray-200';
  const bgHeaderBar = theme === 'light' ? 'bg-white border-b' : 'bg-zinc-800 border-b border-zinc-700';


  return (
    <div className={`flex h-screen ${bgContainer}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className={`${bgHeaderBar} px-6 py-3 shadow flex justify-between items-center`}>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ">Bienvenido, </span>
            <span className="font-semibold text-blue-600 dark:text-green-400">{usuario?.nombre}</span>
          </div>

        </div>
        <main className={`flex-1 p-6 overflow-y-auto ${bgContainer}`}>{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
