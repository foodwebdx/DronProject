import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/login.css'; // Importa los estilos

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        // Simulación de validación (reemplaza con tu lógica de autenticación)
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'password123') {
                setLoading(false);
                navigate('/dashboard'); // Cambia la ruta al dashboard o a la página deseada
            } else {
                setLoading(false);
                setError(true);
            }
        }, 1500); // Simula un tiempo de espera de 1.5 segundos
    };

    return (
        <div className={`login-container ${error ? 'shake' : ''}`}>
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
