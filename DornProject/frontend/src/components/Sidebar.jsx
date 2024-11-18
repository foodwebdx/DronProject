import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menú</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className="sidebar-link">Inicio</Link>
        </li>
        <li>
          <Link to="/createUser" className="sidebar-link">Crear Usuario</Link>
        </li>
        <li>
          <Link to="/createDispositivo" className="sidebar-link">Crear Dispositivo</Link>
        </li>
        <li>
          <Link to="/dispositivos" className="sidebar-link">Lista de Dispositivos</Link>
        </li>
        <li>
          <Link to="/FormularioReserva" className="sidebar-link">Formulario Reserva</Link>
        </li>
      </ul>
      <button className="logout-button" onClick={() => console.log('Cerrar sesión')}>Logout</button>
    </div>
  );
}

export default Sidebar;

