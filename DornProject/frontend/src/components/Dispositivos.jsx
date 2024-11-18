import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../Styles/CRUD.css';
import { Link, useNavigate } from "react-router-dom";

function Dispositivos() {
    const [dispositivos, setDispositivos] = useState([]);
    const navigate = useNavigate(); // Para manejar la navegación

    useEffect(() => {
        axios.get('http://localhost:8081/readDispositivo')
            .then(res => {
                setDispositivos(res.data); // Guardar los datos recibidos en el estado
            })
            .catch(err => console.log(err));
    }, []);

    const handleNavigateBack = () => {
        navigate('/app'); // Navegar a la pantalla anterior
    };

    return (
        <div className='dispositivo-container'>
            <div className='dispositivo-content'>
                <h1 className="dispositivo-title">Dispositivos</h1> {/* Título agregado */}
                <Link to="/createDispositivo" className='dispositivo-add-btn'>Add +</Link>
                <table className='dispositivo-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Ubicación</th>
                            <th>Fecha Última Actividad</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dispositivos.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.idDispositivo}</td>
                                    <td>{data.nombre}</td>
                                    <td>{data.estado}</td>
                                    <td>{data.ubicacion || 'No Disponible'}</td>
                                    <td>{data.fechaUltimaActividad || 'No Disponible'}</td>
                                    <td>
                                        <Link to={`/dispositivoInfo/${data.idDispositivo}`} className='btn btn-primary'>+ INFO</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <button type='button' className='btn btn-secondary' onClick={handleNavigateBack}>Atrás</button>
            </div>
        </div>
    );
}

export default Dispositivos;
