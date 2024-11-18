import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa Font Awesome
import '../styles/AdminInterface.css'; // Archivo de estilos CSS
import { FaBell, FaCogs, FaHistory, FaUsers } from 'react-icons/fa';

const AdminPage = () => {
  return (
    <div className="page-container">
      {/* Barra de estado */}
      <div className="status-bar">
        <div className="left">Estado: Operativo</div>
        <div className="right">Última actualización: {new Date().toLocaleString()}</div>
      </div>

      {/* Contenido principal */}
      <div className="admin-wrapper">
        <div className="admin-container">
          <h1 className="admin-title">Panel de Administración</h1>
          <div className="admin-grid">
            <div className="admin-card">
            <a href="/notificaciones" className="admin-card-link">
            <FaBell size={30} color="#1e3a8a" />
            <h2>Alertas y Notificaciones</h2>
          </a>
            </div>
            <div className="admin-card">
              <FaCogs size={30} color="#1e3a8a" />
              <h2>Drones</h2>
            </div>
            <div className="admin-card">
              <FaHistory size={30} color="#1e3a8a" />
              <h2>Historial de Reservas</h2>
            </div>
            <div className="admin-card">
              <FaUsers size={30} color="#1e3a8a" />
              <h2>Gestión de Usuarios</h2>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminPage;
