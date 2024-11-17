import React, { useState } from 'react'; 
import axios from 'axios';
import '../styles/FormularioReserva.css';

function FormularioReserva() {
    const [idUsuario, setIdUsuario] = useState('');
    const [idDispositivo, setIdDispositivo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/reservarDispositivo', {
            idUsuario,
            idDispositivo,
        })
        .then(() => alert('¡Reserva realizada con éxito!'))
        .catch((err) => console.error(err));
    };

    return (
        <div className="form-container">
            <h1>Reserva de Dispositivos</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="idUsuario">ID Usuario:</label>
                <input 
                    type="number" 
                    id="idUsuario" 
                    value={idUsuario} 
                    onChange={(e) => setIdUsuario(e.target.value)} 
                    required 
                />
                <label htmlFor="idDispositivo">ID Dispositivo:</label>
                <input 
                    type="number" 
                    id="idDispositivo" 
                    value={idDispositivo} 
                    onChange={(e) => setIdDispositivo(e.target.value)} 
                    required 
                />
                <button type="submit">Reservar</button>
            </form>
        </div>
    );
}

export default FormularioReserva;