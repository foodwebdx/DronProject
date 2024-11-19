import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/FormularioReserva.css';

const api = {
    key: '9c2f306636e813bcd95a505775376f4a',
    base: 'https://api.openweathermap.org/data/2.5/',
};

const FormularioReserva = () => {
    const location = useLocation();
    const correoInstitucional = location.state?.correo || "Correo no proporcionado";
    const idDispositivo = location.state?.idDispositivo || null;

    const [fechaReserva, setFechaReserva] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [clima, setClima] = useState(null);
    const [error, setError] = useState('');
    const [animar, setAnimar] = useState(false);

    // Animación de lluvia
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

    // Obtener clima
    const handleCheckWeather = async () => {
        try {
            const res = await fetch(`${api.base}weather?q=${ciudad}&units=metric&appid=${api.key}`);
            const data = await res.json();

            if (data.cod === 200) {
                const currentWeather = data.weather[0].description.toLowerCase();
                console.log('Weather description:', currentWeather); // Log del clima
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

    // Manejo de envío
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAnimar(false);

        const weatherCondition = await handleCheckWeather();
        if (weatherCondition && (weatherCondition.includes('overcast clouds') || weatherCondition.includes('storm'))) {
            setError('No puedes realizar la reserva debido a las condiciones climáticas.');
            setAnimar(true);
            return;
        }

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
        <div className={`form-container ${animar ? 'animar' : ''}`}>
            <div className="rain"></div>

            {/* Botón de regresar */}
            <Link
            to="/ReservarDispositivo"
            state={{ correo: correoInstitucional }} // Pasar el correo como estado
            className="back-button"
            >
            Regresar
            </Link>


            <h1>Reserva de Dispositivo</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <p><strong>Correo:</strong> {correoInstitucional}</p>
                <p><strong>ID del Dispositivo:</strong> {idDispositivo}</p>

                <label htmlFor="ciudad">Ciudad:</label>
                <input
                    type="text"
                    id="ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                />

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
