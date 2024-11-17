import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import CreateUser from './CreateUser';
import MainPage from './MainPage';
import FormularioReserva from './FormularioReserva';
import CreateDispositivo from './CreateDispositivo';
import Dispositivos from './Dispositivos';
import DispositivoInfo from './DispositivosInfo';


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
                    <Route path="/CreateDispositivo" element={<CreateDispositivo/>} />
                    <Route path="Dispositivos" element={<Dispositivos/>} />
                    <Route path='/dispositivoInfo/:idDispositivo' element={<DispositivoInfo />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RoutesNav;
