import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Para guardar el archivo CSV
import Papa from 'papaparse'; // Para generar el CSV
import '../styles/HistorialReservas.css';

const HistorialReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const correoInstitucional = location.state?.correo || "Correo no proporcionado";

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get('http://localhost:8081/historialReservas');
                setReservas(response.data); // Guardar las reservas obtenidas
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener el historial de reservas:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchReservas();
    }, []);

    const handleExportCSV = () => {
        if (reservas.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const csvData = Papa.unparse(reservas); // Convierte los datos a formato CSV
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `Historial_Reservas_${new Date().toISOString().split('T')[0]}.csv`);
    };

    if (loading) return <p>Cargando historial de reservas...</p>;
    if (error) return <p>Error al cargar el historial de reservas. Intenta más tarde.</p>;

    return (
        <div className="historial-reservas-container">
            <h1>Historial de Reservas</h1>
            <table className="reservas-table">
                <thead>
                    <tr>
                        <th>ID Reserva</th>
                        <th>Fecha de Reserva</th>
                        <th>ID Usuario</th>
                        <th>ID Dispositivo</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.idReserva}>
                            <td>{reserva.idReserva}</td>
                            <td>{reserva.fechaReserva}</td>
                            <td>{reserva.idUsuario}</td>
                            <td>{reserva.idDispositivo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/AdminMainInterface', { state: { correo: correoInstitucional } })}
                >
                    Volver
                </button>
                <button className="export-button" onClick={handleExportCSV}>
                    Exportar a CSV
                </button>
            </div>
        </div>
    );
};

export default HistorialReservas;
