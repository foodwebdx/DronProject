import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Styles/FormularioReserva.css';
const FormularioReserva = () => {
    const location = useLocation();
    const correoInstitucional = location.state?.correo || "Correo no proporcionado";
    const idDispositivo = location.state?.idDispositivo || null;

    const [fechaReserva, setFechaReserva] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8081/reservar', {
                correoInstitucional,
                idDispositivo,
                fechaReserva,
            });

            if (response.data.message) {
                alert(response.data.message);
            } else {
                alert("Error al realizar la reserva. Intenta nuevamente.");
            }
        } catch (err) {
            console.error(err);
            setError('Error al realizar la reserva. Intenta de nuevo más tarde.');
        }
    };

    return (
        <div className="form-container1">
            <h1>Reserva de Dispositivo</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <p><strong>Correo:</strong> {correoInstitucional}</p>
                <p><strong>ID del Dispositivo:</strong> {idDispositivo}</p>

                <label htmlFor="fechaReserva">Fecha de Reserva:</label>
                <input
                    type="date"
                    id="fechaReserva"
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    required
                />

                <button type="submit">Reservar</button>
            </form>
        </div>
    );
};

export default FormularioReserva;
