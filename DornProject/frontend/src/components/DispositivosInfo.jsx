import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";  // Importamos useNavigate
import '../Styles/+info.css';

function DispositivoInfo() {
    const { idDispositivo } = useParams(); // Obtener el ID desde los parámetros de la URL
    const [dispositivo, setDispositivo] = useState(null);
    const navigate = useNavigate();  // Inicializamos useNavigate

    useEffect(() => {
        axios.get(`http://localhost:8081/dispositivoInfo/${idDispositivo}`)
            .then(res => {
                setDispositivo(res.data); // Guardar la información del dispositivo
            })
            .catch(err => console.log(err));
    }, [idDispositivo]);

    const handleBackClick = () => {
        navigate(-1); // Retroceder a la página anterior
    };

    return (
        <div className='dispositivo-container'>
            <div className='dispositivo-content'>
                {dispositivo ? (
                    <>
                        <h2>Información del Dispositivo: {dispositivo.nombre}</h2>
                        <p><strong>ID:</strong> {dispositivo.idDispositivo}</p>
                        <p><strong>Nombre:</strong> {dispositivo.nombre}</p>
                        <p><strong>Tipo:</strong> {dispositivo.tipo}</p>
                        <p><strong>Estado:</strong> {dispositivo.estado}</p>
                        <p><strong>Ubicación:</strong> {dispositivo.ubicacion || 'No Disponible'}</p>
                        <p><strong>Nivel de Batería:</strong> {dispositivo.nivelBateria + "%"|| 'No Disponible'}</p>
                        <p><strong>Tiempo de Uso Total:</strong> {dispositivo.tiempoUsoTotal || 'No Disponible'}</p>
                        <p><strong>Fecha Última Actividad:</strong> {dispositivo.fechaUltimaActividad || 'No Disponible'}</p>
                        <p><strong>Capacidad de Carga:</strong> {dispositivo.capacidadCarga} kg</p>
                    </>
                ) : (
                    <p>Cargando información...</p>
                )}

                {/* Botón para regresar a la página anterior */}
                <div className="button-container">
                    <button onClick={handleBackClick}>Regresar</button>
                </div>
            </div>
        </div>
    );
}

export default DispositivoInfo;
