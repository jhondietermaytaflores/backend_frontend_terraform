import { Link } from "react-router-dom"
import { useTheme } from '../context/ThemeContext'; // ruta según tu estructura

//function Header() {
function Header() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className={
      // Ejemplo: en light un gradiente azul, en dark gradiente con tonos verdes
      `shadow-md py-4 px-8 flex justify-between items-center
        bg-gradient-to-r ${
          theme === 'light'
            ? 'from-green-900 to-black text-white'
            : 'from-verdeOscuro-800 to-verdeOscuro-600 text-white'
        }`
    }>
      {/* Título del hotel */}
      <h1 className="text-2xl font-extrabold tracking-wide">
        Hotel Las Nutrias
      </h1>

      {/* Navegación principal */}
      <nav className="flex items-center gap-8">
        

        {/* Toggle para dark/light */}
        <label className="inline-flex items-center relative">
          <input
            className="peer sr-only"
            id="toggle-theme"
            type="checkbox"
            aria-label="Cambiar tema claro/oscuro"
            onChange={handleToggle}
            checked={theme === 'dark'}
          />
          <div
            className={`relative w-[85px] h-[34px] ${
              theme === 'dark' ? 'bg-zinc-700' : 'bg-white'
            } rounded-full shadow-sm duration-300 peer-checked:bg-zinc-500 after:absolute after:content-[''] after:w-[26px] after:h-[26px] ${
              theme === 'dark'
                ? 'after:from-verdeOscuro-500 after:to-verdeOscuro-400'
                : 'from-orange-500 to-yellow-400'
            } bg-gradient-to-r peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[4px] after:left-[4px] active:after:w-[62px] peer-checked:after:left-[66px] peer-checked:after:translate-x-[-100%] duration-300 after:duration-300 after:shadow-md`}
          />
          {/* Iconos: ajustar colores según estado */}
          <svg
            viewBox="0 0 24 24"
            className={`absolute w-4 h-4 left-[10px] ${
              theme === 'dark'
                ? 'opacity-70 fill-white'
                : 'fill-white peer-checked:opacity-60'
            }`}
          >
            <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className={`absolute w-4 h-4 right-[10px] ${
              theme === 'dark'
                ? 'opacity-100 fill-white'
                : 'fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white'
            }`}
          >
            <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z" />
          </svg>
        </label>

        {/* Avatar del usuario */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Usuario"
            className="w-full h-full object-cover"
          />
        </div>
      </nav>
    </header>
  );
}

export default Header
