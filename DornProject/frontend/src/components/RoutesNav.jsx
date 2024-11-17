import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import CreateUser from './CreateUser';
import MainPage from './MainPage';
import FormularioReserva from './FormularioReserva';


function RoutesNav() {
    return (
        <div className="RoutesNav">
            <BrowserRouter>
                <Routes>
                    {/* Redirección por defecto a login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    
                    {/* Rutas principales */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/CreateUser" element={<CreateUser />} />

                    <Route path="/MainPage" element={<MainPage />} />
                    <Route path="/FormularioReserva" element={<FormularioReserva/>} />

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RoutesNav;
