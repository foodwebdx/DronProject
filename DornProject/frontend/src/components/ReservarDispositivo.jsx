import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Agregar useNavigate para redirigir
import '../styles/ReservarDispositivo.css';

import drone1 from '../styles/images/dron1.png';
import robot1 from '../styles/images/robott1.png';
import drone2 from '../styles/images/dron2.png';
import robot2 from '../styles/images/robot2.png';
import drone3 from '../styles/images/dron3.png';
import robot3 from '../styles/images/robot3.png';

const ReservarDispositivo = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook para redirigir
    const correoInstitucional = location.state?.correo || "Correo no proporcionado";

    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Mapeo de IDs a imágenes locales
    const imageMap = {
        1: drone1,
        2: robot1,
        3: drone2,
        4: robot2,
        5: drone3,
        6: robot3,
    };

    useEffect(() => {
        const fetchDispositivos = async () => {
            try {
                const response = await axios.get('http://localhost:8081/dispositivos');
                const dispositivosData = response.data.map((dispositivo) => ({
                    ...dispositivo,
                    imagen: imageMap[dispositivo.idDispositivo] || null, // Asignar imagen según el ID
                }));
                setDispositivos(dispositivosData);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener los dispositivos:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchDispositivos();
    }, []);

    const handleReservar = async (idDispositivo) => {
        navigate('/FormularioReserva', {
            state: { correo: correoInstitucional, idDispositivo },
        });
    };

    if (loading) return <p>Cargando dispositivos...</p>;
    if (error) return <p>Error al cargar los dispositivos. Intenta más tarde.</p>;

    return (

        <div className="dispositivos-container">
            
            <h1>Reservar Dispositivo</h1>
            <p>Usuario: {correoInstitucional}</p> {/* Mostrar correo del usuario */}
            <div className="dispositivos-grid">
                {dispositivos.map((dispositivo) => (
                    <div key={dispositivo.idDispositivo} className="dispositivo-card">
                        <img src={dispositivo.imagen} alt={dispositivo.nombre} className="dispositivo-image" />
                        <h2>{dispositivo.nombre}</h2>
                        <p>Tipo: {dispositivo.tipo}</p>
                        <p>Estado: {dispositivo.estado || "No disponible"}</p>
                        <button
                            className="reservar-button"
                            onClick={() => handleReservar(dispositivo.idDispositivo)} // Redirigir al formulario
                            disabled={dispositivo.estado === "Reservado"} // Deshabilitar si ya está reservado
                        >
                            {dispositivo.estado === "Reservado" ? "Reservado" : "Reservar"}
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ReservarDispositivo;
