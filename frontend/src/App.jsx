import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Habitaciones from './paginas/cliente/HabitacionesCliente'
import Reservas from './paginas/cliente/ReservasCliente'

import DashboardLayout from './componentes/DashboardLayout'
import InicioAdmin from './paginas/dashboard/InicioAdmin'
import HabitacionesAdmin from './paginas/dashboard/HabitacionesAdmin'
import ReservasAdmin from './paginas/dashboard/ReservasAdmin'
import PedidosAdmin from './paginas/dashboard/PedidosAdmin'
import UsuariosAdmin from './paginas/dashboard/UsuariosAdmin'
import ProductosAdmin from './paginas/dashboard/ProductosAdmin'
import InventarioAdmin from './paginas/dashboard/InventarioAdmin'
import InventarioHabitacion from './paginas/dashboard/InventarioHabitacion'
import InventarioSector from './paginas/dashboard/InventarioSector'

import CatalogoHabitaciones from './paginas/dashboard/CatalogoHabitaciones'

import UsuariosClientesAdmin from './paginas/dashboard/UsuariosClientesAdmin'
import UsuariosEmpleadosAdmin from './paginas/dashboard/UsuariosEmpleadosAdmin'

//import FaceLogin from './paginas/empleados/FaceLogin'

import NoAutorizado from './paginas/NoAutorizado'

import InicioCliente from './paginas/roles_login/cliente/InicioCliente'
import InicioRecepcionista from './paginas/roles_login/recepcionista/InicioRecepcionista'
import InicioCamarero from './paginas/roles_login/camarero/InicioCamarero'
import InicioCocinero from './paginas/roles_login/cocinero/InicioCocinero'
import InicioLimpieza from './paginas/roles_login/limpieza/InicioLimpieza'

import {
  RutaCliente,
  RutaRecepcionista,
  RutaCamarero,
  RutaCocinero,
  RutaLimpieza, RutaAdmin
} from './rutas/RutasProtegidas'

//import { RutaAdmin, RutaCliente } from './rutas/RutasProtegidas'
import FaceLoginDescriptors from './paginas/empleados/FaceLoginDescriptors'
import FaceRegistrationDescriptors from './paginas/empleados/FaceRegistrationDescriptors'

import AsignacionesAdmin from './paginas/dashboard/AsignacionesAdmin'
import TiposTareaAdmin from './paginas/dashboard/TiposTareaAdmin'

/* import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext'; */


/* ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
); */

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* Cliente protegido */}
          <Route path="/habitaciones" element={
            <RutaCliente><Habitaciones /></RutaCliente>
          } />
          <Route path="/reservas" element={
            <RutaCliente><Reservas /></RutaCliente>
          } />

          {/* Admin protegido */}
          <Route path="/admin" element={
            <RutaAdmin><DashboardLayout><InicioAdmin /></DashboardLayout></RutaAdmin>
          } />
          <Route path="/admin/habitaciones" element={
            <RutaAdmin><DashboardLayout><HabitacionesAdmin /></DashboardLayout></RutaAdmin>
          } />
          <Route path="/admin/reservas" element={
            <RutaAdmin><DashboardLayout><ReservasAdmin /></DashboardLayout></RutaAdmin>
          } />
          <Route path="/admin/pedidos" element={
            <RutaAdmin><DashboardLayout><PedidosAdmin /></DashboardLayout></RutaAdmin>
          } />
          <Route path="/admin/usuarios" element={
            <RutaAdmin><DashboardLayout><UsuariosAdmin /></DashboardLayout></RutaAdmin>
          } />
          <Route path="/admin/productos" element={
            <RutaAdmin><DashboardLayout><ProductosAdmin /></DashboardLayout></RutaAdmin>
          } />

          <Route path="/admin/inventario" element={
            <RutaAdmin><DashboardLayout><InventarioAdmin /></DashboardLayout></RutaAdmin>
          } />

          <Route path="/tipos-tarea" element={<DashboardLayout> <TiposTareaAdmin /> </DashboardLayout>} />


          <Route path="/asignaciones" element={<DashboardLayout> <AsignacionesAdmin /> </DashboardLayout>} />


          <Route path="/admin/inventarioHabitacion" element={<DashboardLayout><InventarioHabitacion /></DashboardLayout>} />
          <Route path="/admin/inventarioSector" element={<DashboardLayout><InventarioSector /></DashboardLayout>} />

          <Route path="/admin/catalogo-habitaciones" element={<DashboardLayout><CatalogoHabitaciones /></DashboardLayout>} />

          <Route path="/admin/usuarios-clientes" element={<DashboardLayout><UsuariosClientesAdmin /></DashboardLayout>} />
          <Route path="/admin/usuarios-empleados" element={<DashboardLayout><UsuariosEmpleadosAdmin /></DashboardLayout>} />

          {/* estas dos ultimas , fue usado para pruebas del reconocimiento facial */}

          <Route path="/FaceLoginDescriptor" element={<FaceLoginDescriptors />} />

          <Route path="/FaceRegistrationDescriptors" element={<FaceRegistrationDescriptors />} />


          {/* Roles protegidos de los empleados */}
          {/* Cliente */}
          <Route path="/cliente" element={
            <RutaCliente><InicioCliente /></RutaCliente>
          } />

          {/* Recepcionista */}
          <Route path="/recepcionista" element={
            <RutaRecepcionista><InicioRecepcionista /></RutaRecepcionista>
          } />

          {/* Camarero */}
          <Route path="/camarero" element={
            <RutaCamarero><InicioCamarero /></RutaCamarero>
          } />

          {/* Cocinero */}
          <Route path="/cocinero" element={
            <RutaCocinero><InicioCocinero /></RutaCocinero>
          } />

          {/* Limpieza */}
          <Route path="/limpieza" element={
            <RutaLimpieza><InicioLimpieza /></RutaLimpieza>
          } />


        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
