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
    
    async function authentication(correoInstitucional, contraseña) {
        try {
            const response = await axios.get('http://localhost:8081/auth', {
                params: { correoInstitucional, contraseña }
            });
    
            return response.data; // Devuelve la respuesta completa
        } catch (error) {
            console.error("Error en la autenticación:", error);
            return { success: false }; // Devuelve un objeto con `success: false` si hay un error
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
        setLoading(true);
        setError(false);
    
        if (!isEmailFormatted(correoInstitucional)) {
            alert("El correo debe incluir @javerianacali.edu.co.");
            ErrorDetected = true;
        } else if (!(await mailExists(correoInstitucional))) {
            alert("El correo no existe. Verifica nuevamente.");
            ErrorDetected = true;
        }
    
        if (ErrorDetected) {
            setLoading(false);
            return;
        }
    
        const authResult = await authentication(correoInstitucional, contraseña);
        if (!authResult.success) {
            setTries(tries + 1);
            alert("Contraseña incorrecta. Te quedan " + (2 - tries) + " intentos.");
            if (tries === 2) {
                sendNotification(correoInstitucional, `El usuario ${correoInstitucional} tuvo 3 intentos fallidos.`);
                setLoading(true);
            }
            else{
                setLoading(false);  
            }
    
        } else {
            setTries(0);
    
            // Redirige según el rol
            if (authResult.rol === "Administrador") {
                navigate('/AdminMainInterface', { state: { correo: correoInstitucional } }); // Redirige a la página del administrador
            } else {
                navigate('/Sidebar', { state: { correo: correoInstitucional } }); // Redirige al menú principal del usuario
            }
        }
    };
    

    return (
        <div className={`login-container ${error ? 'shake' : ''}`}>
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                <input
                    id='correo'
                    type="email"
                    placeholder="Correo electrónico"
                    value={correoInstitucional}
                    onChange={(e) => SetCorreo(e.target.value)}
                    required
                />
                <input
                    id='password'
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
