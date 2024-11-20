import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar Link y useLocation
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa Font Awesome
import '../styles/AdminInterface.css'; // Archivo de estilos CSS
import { FaBell, FaCogs, FaHistory, FaUsers } from 'react-icons/fa';

const AdminPage = () => {
  const location = useLocation();
  const correoInstitucional = location.state?.correo || "Correo no proporcionado"; // Obtener correo

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
            {/* Alertas y notificaciones */}
            <div className="admin-card">
              <Link
                to="/notificaciones"
                state={{ correo: correoInstitucional }} // Pasar el correo al componente de notificaciones
                className="admin-card-link"
              >
                <FaBell size={30} color="#1e3a8a" />
                <h2>Alertas y Notificaciones</h2>
              </Link>
            </div>
            {/* Reservar dispositivo */}
            <div className="admin-card">
              <Link
                to="/ReservarDispositivo"
                state={{ correo: correoInstitucional }} // Pasar el correo al componente de reservas
                className="admin-card-link"
              >
                <FaCogs size={30} color="#1e3a8a" />
                <h2>Reservar Dispositivo</h2>
              </Link>
            </div>
            {/* Historial de reservas */}
            <div className="admin-card">
              <Link
                to="/historialReservas"
                state={{ correo: correoInstitucional }} // Pasar el correo al componente de reservas
                className="admin-card-link"
              >
                <FaHistory size={30} color="#1e3a8a" />
                <h2>Historial Reservas</h2>
              </Link>
            </div>
            {/* Gestión de usuarios */}
            <div className="admin-card">
              <Link
                to="/CreateUser"
                state={{ correo: correoInstitucional }} // Pasar el correo al componente de gestión de usuarios si necesario
                className="admin-card-link"
              >
                <FaUsers size={30} color="#1e3a8a" />
                <h2>Gestión de Usuarios</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
