import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para el botón de regresar
import '../Styles/CreateUser.css';

function CreateUser() {
    const [nombreCompleto, SetNombreCompleto] = useState('');
    const [PrimerNombre, SetPrimerNombre] = useState('');
    const [Apellido1, SetApellido1] = useState('');
    const [Apellido2, SetApellido2] = useState('');
    const [correoInstitucional, SetCorreo] = useState('');
    const [contraseña, SetContraseña] = useState('');
    const [rol, SetRol] = useState('');
    const [numeroContacto, SetTelefono] = useState('');    
    const navigate = useNavigate();

    function isPasswordValid(password) {
        if (password.length < 8 || password.length > 20) {
            return false;
        }
        return true;
    }

    function isEmailValid(mail) {
        if (mail.includes('javerianacali.edu.co')) {
            return true;
        } else {
            return false;
        }
    }

    function isRoleValid(role) {
        if (role === 'Administrador' || role === 'Usuario') {
            return true;
        } else {
            return false;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        let ErrorDetected = false;
        let fullName = '';

        if (!isPasswordValid(contraseña)) {
            alert("Password must be between 8 and 20 characters.");
            ErrorDetected = true; 
        }
        
        if (!isEmailValid(correoInstitucional)) {
            alert("Email must include @javerianacali.edu.co.");
            ErrorDetected = true; 
        }

        if (!isRoleValid(rol)) {
            alert("Role must be Admin or Usuario.");
            ErrorDetected = true; 
        }

        if (ErrorDetected) {
            return;
        }

        fullName = PrimerNombre + ' ' + Apellido1 + ' ' + Apellido2;
        SetNombreCompleto(fullName);

        axios.post('http://localhost:8081/createUser', {
            nombreCompleto: fullName,
            correoInstitucional,
            contraseña,
            rol,
            numeroContacto
        })
        .then(res => {
            console.log(res);
            navigate('/');
        })
        .catch(err => console.log(err));
    }

    return (
        <div className='user-container'>
            <div className='user-content'>
                {/* Botón de regresar */}
                <Link to="/sidebar" className="back-button">Regresar</Link>

                <form onSubmit={handleSubmit}> 
                    <h2>Create New User</h2>
                    <div className='text-input'>
                        <label htmlFor='First Name'>Enter Name</label>
                        <input 
                            type='text' 
                            placeholder='Enter Name' 
                            className='form-control'
                            onChange={e => SetPrimerNombre(e.target.value)} 
                        />

                        <label htmlFor='Last Name 1'>Enter Last Name 1</label>
                        <input 
                            type='text' 
                            placeholder='Enter Last Name 1' 
                            className='form-control'
                            onChange={e => SetApellido1(e.target.value)} 
                        />

                        <label htmlFor='Last Name 2'>Enter Last Name 2</label>
                        <input 
                            type='text' 
                            placeholder='Enter Last Name 2' 
                            className='form-control'
                            onChange={e => SetApellido2(e.target.value)} 
                        />

                        <label htmlFor='Email'>Enter Email</label>
                        <input 
                            type='text' 
                            placeholder='Enter Email' 
                            className='form-control'
                            onChange={e => SetCorreo(e.target.value)} 
                        />
                        
                        <label htmlFor='Password'>Password</label>
                        <input 
                            type='password' 
                            placeholder='Password' 
                            className='form-control'
                            onChange={e => SetContraseña(e.target.value)} 
                        />
                        
                        <label htmlFor='Rol'>Rol</label>
                        <select 
                            className='form-control'
                            onChange={(e) => SetRol(e.target.value)}
                        >
                        <option value="">Selecciona el tipo de usuario</option>
                        <option value="Usuario">Usuario</option>
                        <option value="Administrador">Administrador</option>
                        </select>

                        <label htmlFor='Numero Telefono'>Numero Telefono</label>
                        <input 
                            type='text' 
                            placeholder='Nro Telefono' 
                            className='form-control'
                            onChange={e => SetTelefono(e.target.value)} 
                        />
                    </div>
                    <div className='button'>
                        <button type='submit' className='button'>Submit</button>
                    </div>
                </form>
            </div>  
        </div>
    );
}

export default CreateUser;
