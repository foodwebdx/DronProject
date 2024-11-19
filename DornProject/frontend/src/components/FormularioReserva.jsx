import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importamos Link para el botón
import '../styles/FormularioReserva.css';

const api = {
    key: '9c2f306636e813bcd95a505775376f4a',
    base: 'https://api.openweathermap.org/data/2.5/',
};

function FormularioReserva() {
    const [idUsuario, setIdUsuario] = useState('');
    const [idDispositivo, setIdDispositivo] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [clima, setClima] = useState(null);
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
        setAnimar(false);

        const weatherCondition = await handleCheckWeather();
        if (weatherCondition && (weatherCondition.includes('overcast clouds') || weatherCondition.includes('storm'))) {
            setError('No puedes realizar la reserva debido a las condiciones climáticas.');
            setAnimar(true);
            return;
        }

        axios.post('http://localhost:8081/reservarDispositivo', {
            idUsuario,
            idDispositivo,
        })
        .catch((err) => {
            console.error(err);
            setError('Error al realizar la reserva. Intenta de nuevo más tarde.');
        });
    };

    return (
        <div className={`form-container ${animar ? 'animar' : ''}`}>
            {/* Botón de regresar */}
            <Link to="/sidebar" className="back-button">Regresar</Link>

            <div className="rain"></div>
            <h1>Reserva de Dispositivos</h1>
            {error && <p className="error">{error}</p>}
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
                <label htmlFor="ciudad">Ciudad:</label>
                <input 
                    type="text" 
                    id="ciudad" 
                    value={ciudad} 
                    onChange={(e) => setCiudad(e.target.value)} 
                    required 
                />
                <button type="submit">Reservar</button>
            </form>
        </div>
    );
}

export default FormularioReserva;
