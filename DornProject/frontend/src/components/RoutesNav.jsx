import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import CreateUser from './CreateUser';

function RoutesNav() {
    return (
        <div className='RoutesNav'>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/CreateUser" element={<CreateUser />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RoutesNav;
