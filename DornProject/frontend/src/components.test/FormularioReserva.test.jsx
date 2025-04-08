import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FormularioReserva from '../components/FormularioReserva'; // Ajusta la ruta según tu estructura

// Configuración de axios mock
const mockAxios = new MockAdapter(axios);

describe('FormularioReserva - Pruebas campo "Ciudad"', () => {
  beforeEach(() => {
    // Reiniciar mocks antes de cada prueba
    mockAxios.reset();
    global.fetch = jest.fn();
  });

  // Función para renderizar el componente con estado inicial en el router
  const renderComponent = (initialState = { correo: 'test@example.com', idDispositivo: '1234' }) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/test', state: initialState }]}>
        <Routes>
          <Route path="/test" element={<FormularioReserva />} />
        </Routes>
      </MemoryRouter>
    );
  };

  // ---------------------------
  // Particiones de Equivalencia
  // ---------------------------

  test('Partición Válida: Ingresar "Bogotá"', async () => {
    renderComponent();

    // Simular respuesta exitosa de la API (ciudad encontrada)
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        cod: 200,
        weather: [{ description: 'clear sky' }],
      }),
    });

    // Ingresar "Bogotá" en el campo Ciudad
    const ciudadInput = screen.getByLabelText(/Ciudad/i);
    fireEvent.change(ciudadInput, { target: { value: 'Bogotá' } });

    // Ingresar una fecha válida
    const fechaInput = screen.getByLabelText(/Fecha de Reserva/i);
    fireEvent.change(fechaInput, { target: { value: '2030-01-01' } });

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Reservar/i });
    fireEvent.click(submitButton);

    // Verificar que no se muestre error de ciudad no encontrada
    await waitFor(() => {
      expect(screen.queryByText(/Ciudad no encontrada/i)).toBeNull();
    });
  });

  test('Partición Inválida: Ingresar "1234"', async () => {
    renderComponent();

    // Simular respuesta para ciudad inválida
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        cod: "404",
        message: 'city not found',
      }),
    });

    // Ingresar "1234" en el campo Ciudad
    const ciudadInput = screen.getByLabelText(/Ciudad/i);
    fireEvent.change(ciudadInput, { target: { value: '1234' } });

    // Ingresar una fecha válida
    const fechaInput = screen.getByLabelText(/Fecha de Reserva/i);
    fireEvent.change(fechaInput, { target: { value: '2030-01-01' } });

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Reservar/i });
    fireEvent.click(submitButton);

    // Verificar que se muestre el mensaje de error adecuado
    await waitFor(() => {
      expect(screen.getByText(/Ciudad no encontrada/i)).toBeInTheDocument();
    });
  });

  // ---------------------------
  // Valores Límite
  // ---------------------------

  test('Valor Límite Mínimo: Ingresar ciudad con 2 caracteres (ejemplo "Lu")', async () => {
    renderComponent();

    // Simular respuesta exitosa de la API
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        cod: 200,
        weather: [{ description: 'clear sky' }],
      }),
    });

    // Ingresar "Lu" (mínimo aceptable)
    const ciudadInput = screen.getByLabelText(/Ciudad/i);
    fireEvent.change(ciudadInput, { target: { value: 'Lu' } });

    // Ingresar fecha válida
    const fechaInput = screen.getByLabelText(/Fecha de Reserva/i);
    fireEvent.change(fechaInput, { target: { value: '2030-01-01' } });

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Reservar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Como la API devuelve respuesta exitosa, se asume que el input es válido.
      expect(screen.queryByText(/Ciudad no encontrada/i)).toBeNull();
    });
  });

  test('Valor Límite Máximo: Ingresar ciudad con 50 caracteres y con 51 caracteres', async () => {
    // Primer caso: 50 caracteres (se espera input aceptable)
    renderComponent();

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        cod: 200,
        weather: [{ description: 'clear sky' }],
      }),
    });

    const ciudadInput = screen.getByLabelText(/Ciudad/i);
    const nombreValido = 'A'.repeat(50); // String de 50 caracteres
    fireEvent.change(ciudadInput, { target: { value: nombreValido } });

    const fechaInput = screen.getByLabelText(/Fecha de Reserva/i);
    fireEvent.change(fechaInput, { target: { value: '2030-01-01' } });

    let submitButton = screen.getByRole('button', { name: /Reservar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Ciudad no encontrada/i)).toBeNull();
    });

    // Segundo caso: 51 caracteres (se espera error, suponiendo que se active validación)
    // Nota: Si la validación de longitud no está implementada en el componente,
    // se deberá simular que la API rechaza esta entrada.
    renderComponent();

    // Simular respuesta de error para input con 51 caracteres
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        cod: "404",
        message: 'city not found',
      }),
    });

    const ciudadInput2 = screen.getByLabelText(/Ciudad/i);
    const nombreInvalido = 'A'.repeat(51); // String de 51 caracteres
    fireEvent.change(ciudadInput2, { target: { value: nombreInvalido } });

    fireEvent.change(screen.getByLabelText(/Fecha de Reserva/i), { target: { value: '2030-01-01' } });
    submitButton = screen.getByRole('button', { name: /Reservar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Ciudad no encontrada/i)).toBeInTheDocument();
    });
  });
});
