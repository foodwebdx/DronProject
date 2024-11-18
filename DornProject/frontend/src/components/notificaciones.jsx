import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import '../styles/AlertNotifications.css';

const AlertNotifications = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Estado para el campo de búsqueda

    // Función para obtener las alertas desde el backend
    const fetchAlerts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/NotificacionesYalertas'); // Consulta al backend
            setAlerts(response.data); // Guarda los datos recibidos
            setLoading(false);
        } catch (err) {
            console.error("Error al obtener las alertas:", err);
            setError(true);
            setLoading(false);
        }
    };

    // Función para manejar la eliminación
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/borrar/${id}`);
            setAlerts(alerts.filter(alert => alert.idNotificacion !== id)); // Actualiza la lista localmente
            alert('Notificación eliminada exitosamente');
        } catch (error) {
            console.error("Error al eliminar la notificación:", error);
            alert('Hubo un problema al eliminar la notificación');
        }
    };

    // Filtrar las alertas según el campo de búsqueda
    const filteredAlerts = alerts.filter((alert) =>
        alert.mensaje.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Llama a la función fetchAlerts al cargar el componente
    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <div className="alerts-container">
            <h1>Alertas y Notificaciones</h1>

            {/* Campo de búsqueda */}
            <input
                type="text"
                placeholder="Buscar notificaciones..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            {loading ? (
                <p>Cargando alertas...</p>
            ) : error ? (
                <p>Error al cargar las alertas. Intenta nuevamente más tarde.</p>
            ) : filteredAlerts.length === 0 ? (
                <p>No hay alertas que coincidan con tu búsqueda.</p>
            ) : (
                <ul className="alert-list">
                    {filteredAlerts.map((alert, index) => (
                        <li key={index} className="alert-item">
                            <div className="alert-content">
                                <div>
                                    <h2>{alert.titulo}</h2>
                                    <p>{alert.mensaje}</p>
                                </div>
                                <div className="alert-actions">
                                    <FaTrash
                                        size={15}
                                        color="#d9534f"
                                        onClick={() => handleDelete(alert.idNotificacion)}
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlertNotifications;
