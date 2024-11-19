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
    const [animar, setAnimar] = useState(false);

    useEffect(() => {
        if (animar) {
            const generateRain = () => {
                const rainContainer = document.querySelector('.rain');
                for (let i = 0; i < 100; i++) {
                    const drop = document.createElement('div');
                    drop.classList.add('drop');
                    drop.style.left = `${Math.random() * 100}vw`;
                    drop.style.animationDuration = `${Math.random() * 2 + 0.5}s`;
                    drop.style.animationDelay = `${Math.random() * 2}s`;
                    rainContainer.appendChild(drop);
                }
            };

            generateRain();
        }

        setTimeout(() => {
            setAnimar(false);
        }, 5000);
    }, [animar]);

    const handleCheckWeather = async () => {
        try {
            const res = await fetch(`${api.base}weather?q=${ciudad}&units=metric&appid=${api.key}`);
            const data = await res.json();
    
            if (data.cod === 200) {
                const currentWeather = data.weather[0].description.toLowerCase();
                console.log('Weather description:', currentWeather); // Mostrar en la consola
                setClima(currentWeather);
                return currentWeather;
            } else {
                setError('Ciudad no encontrada. Verifica el nombre e inténtalo de nuevo.');
                return null;
            }
        } catch (err) {
            console.error(err);
            setError('Error al obtener el clima. Intenta de nuevo más tarde.');
            return null;
        }
    };
    

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
