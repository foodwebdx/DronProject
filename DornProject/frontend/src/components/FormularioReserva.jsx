import React, { useState } from 'react'; 
import '../styles/FormularioReserva.css'

function FormularioReserva() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    dispositivo: '',
    fecha: '',
    motivo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    alert('¡Reserva realizada con éxito!');
  };

  return (
    <div className="form-container">
      <h1>Reserva de Dispositivos</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="dispositivo">Dispositivo:</label>
        <select
          id="dispositivo"
          name="dispositivo"
          value={formData.dispositivo}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un dispositivo</option>
          <option value="Laptop">Laptop</option>
          <option value="Tablet">Tablet</option>
          <option value="Smartphone">Smartphone</option>
        </select>

        <label htmlFor="fecha">Fecha:</label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />

        <label htmlFor="motivo">Motivo de la Reserva:</label>
        <textarea
          id="motivo"
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          required
        />

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
}

export default FormularioReserva;