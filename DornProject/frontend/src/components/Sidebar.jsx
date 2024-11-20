import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const correoInstitucional = location.state?.correo || "Correo no proporcionado";

  return (
    <div className="sidebar">
      {/* Mostrar el correo del usuario */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">Bienvenido</h2>
        <p className="user-email">{correoInstitucional}</p>
      </div>

      {/* Menú */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className="sidebar-link">Inicio</Link>
        </li>
        <li>
          <Link to="/dispositivos" className="sidebar-link">Crear Dispositivo</Link> {/* Este no pasa correo */}
        </li>
        <li>
          <Link
            to="/ReservarDispositivo"
            state={{ correo: correoInstitucional }} // Pasar el correo al componente ReservarDispositivo
            className="sidebar-link"
          >
            Reservar Dispositivo
          </Link> {/* Este pasa correo */}
        </li>
      </ul>

      {/* Botón de logout */}
      <button
        className="logout-button"
        onClick={() => console.log('Cerrar sesión')}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
