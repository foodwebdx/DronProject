import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/CreateUser.css';

function CreateDispositivo() {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [estado, setEstado] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [nivelBateria, setNivelBateria] = useState('');
    const [tiempoUsoTotal, setTiempoUsoTotal] = useState('');
    const [fechaUltimaActividad, setFechaUltimaActividad] = useState('');
    const [capacidadCarga, setCapacidadCarga] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function validateForm() {
        if (!nombre || !tipo || !estado || !ubicacion || !nivelBateria || !tiempoUsoTotal || !fechaUltimaActividad || !capacidadCarga) {
            setErrorMessage('Please fill in all the fields.');
            return false;
        }
        if (nivelBateria < 0 || nivelBateria > 100) {
            setErrorMessage('Battery level must be between 0 and 100.');
            return false;
        }
        if (tiempoUsoTotal < 0) {
            setErrorMessage('Total usage time must be a positive number.');
            return false;
        }
        setErrorMessage('');
        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!validateForm()) return;

        const formattedDate = new Date(fechaUltimaActividad).toISOString().split('T')[0]; 

        axios.post('http://localhost:8081/createDispositivo', {
            nombre,
            tipo,
            estado,
            ubicacion,
            nivelBateria,
            tiempoUsoTotal,
            fechaUltimaActividad: formattedDate,
            capacidadCarga
        })
        .then(res => {
            console.log(res);
            navigate('/Sidebar'); // Cambiar ruta si es necesario
        })
        .catch(err => {
            console.log(err);
            setErrorMessage('Failed to create device. Please try again.');
        });
    }

    return (
        <div className='user-container'>
            <div className='user-content'>
                {/* Botón para regresar al sidebar */}
                <Link to="/Sidebar" className="back-button">Regresar</Link>

                <form onSubmit={handleSubmit}> 
                    <h2>Create New Device</h2>
                    
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className='text-input'>
                        {/* Campos del formulario */}
                        <label htmlFor='Nombre'>Device Name</label>
                        <input 
                            id='nombre'
                            type='text' 
                            placeholder='Enter device name' 
                            className='form-control'
                            onChange={e => setNombre(e.target.value)} 
                        />

                        <label htmlFor='Tipo'>Device Type</label>
                        <select 
                            id='tipo'
                            className='form-control'
                            onChange={e => setTipo(e.target.value)}
                        >
                            <option value="">Select type</option>
                            <option value="Aereo">Aereo</option>
                            <option value="Terrestre">Terrestre</option>
                        </select>

                        <label htmlFor='Estado'>Status</label>
                        <select 
                            id='estado'
                            className='form-control'
                            onChange={e => setEstado(e.target.value)}
                        >
                            <option value="">Select status</option>
                            <option value="Disponible">Disponible</option>
                            <option value="EnReparacion">En Reparación</option>
                            <option value="FueraDeServicio">Fuera de Servicio</option>
                        </select>

                        <label htmlFor='Ubicacion'>Location</label>
                        <input 
                            id='ubicacion'
                            type='text' 
                            placeholder='Enter location' 
                            className='form-control'
                            onChange={e => setUbicacion(e.target.value)} 
                        />

                        <label htmlFor='NivelBateria'>Battery Level (%)</label>
                        <input 
                            id='nivelBateria'
                            type='number' 
                            placeholder='Enter battery level' 
                            className='form-control'
                            onChange={e => setNivelBateria(e.target.value)} 
                        />

                        <label htmlFor='TiempoUsoTotal'>Total Usage Time (hours)</label>
                        <input 
                            id='tiempoUsoTotal'
                            type='number' 
                            placeholder='Enter total usage time' 
                            className='form-control'
                            onChange={e => setTiempoUsoTotal(e.target.value)} 
                        />

                        <label htmlFor='FechaUltimaActividad'>Last Activity Date</label>
                        <input 
                            id='fechaUltimaActividad'
                            type='date' 
                            className='form-control'
                            onChange={e => setFechaUltimaActividad(e.target.value)} 
                        />

                        <label htmlFor='CapacidadCarga'>Load Capacity (kg)</label>
                        <select 
                            id='capacidadCarga'
                            className='form-control'
                            onChange={e => setCapacidadCarga(e.target.value)}
                        >
                            <option value="">Select capacity</option>
                            <option value="0.5">0.5</option>
                            <option value="1">1</option>
                        </select>
                    </div>
                    <div className='button'>
                        <button type='submit' className='button'>Submit</button>
                    </div>
                </form>
            </div>  
        </div>
    );
}

export default CreateDispositivo;
