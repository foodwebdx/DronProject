import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/login.css'; // Importa los estilos

function Login() {
    const [tries, setTries] = useState(0);
    const [correoInstitucional, SetCorreo] = useState('');
    const [contraseña, SetContraseña] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    function isEmailFormatted(mail){
        if(mail.includes('javerianacali.edu.co')){
            return true;
        }
        else{
            return false;
        }
    }

    async function mailExists(correoInstitucional) {
        try {
            const response = await axios.get('http://localhost:8081/mailExists', {
                params: { correoInstitucional }
            });

            return response.data; // true if exists, false if not
        } catch (error) {
            console.error("Error:", error);
            return false; // or handle error as needed
        }
    }
    
    async function authentication(correoInstitucional, constraseña) {
        try {
            const response = await axios.get('http://localhost:8081/auth', {
                params: { correoInstitucional , contraseña}
            });

            return response.data; // true if exists, false if not
        } catch (error) {
            console.error("Error:", error);
            return false; // or handle error as needed
        }
    }

    async function sendNotification(correoInstitucional, mensaje){
        try{
            const response = await axios.post('http://localhost:8081/notif', {
                mensaje,
                correoInstitucional
            });
            return response.data;
        }
        catch(error){
            console.error("Error:", error);
            return false;
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        let ErrorDetected = false;
        let mensaje = "";
        let sent = false;
        setLoading(true);
        setError(false);

        if (!isEmailFormatted(correoInstitucional)) {
            alert("Email must @javerianacali.edu.co.");
            ErrorDetected = true; 
        }
        else if (!(await mailExists(correoInstitucional))) {
            alert("Email does not exist. Please check again");
            ErrorDetected = true;
        }

        if (ErrorDetected) {             
            setLoading(false);
            return;} // Prevent form submission}

        if (!(await authentication(correoInstitucional, contraseña))) {
            setTries(tries + 1);
            alert("Incorrect password. You have " + (2 - tries) + " tries left.");
            if (tries < 2){
                setLoading(false);
                mensaje = "El usuario " +correoInstitucional+ " tuvo 3 intentos de sesion fallidos.";
                if (!sent){
                    sendNotification(correoInstitucional, mensaje);
                    sent = true;
                }
            }
        }
        else{
            alert("Success");
            setTries(0);
            navigate('/mainpage');
        }
    };

    return (
        <div className={`login-container ${error ? 'shake' : ''}`}>
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correoInstitucional}
                    onChange={(e) => SetCorreo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => SetContraseña(e.target.value)}
                    required
                />
                {loading ? (
                    <div className="loading-bar">
                        <div className="progress"></div>
                    </div>
                ) : (
                    <button type="submit">Iniciar sesión</button>
                )}
                <p className="register-link" onClick={() => navigate('/CreateUser')}>
                    Registrarme
                </p>
            </form>
        </div>
    );
}

export default Login;
