describe('TC-001: Validación Sistema de Reserva', () => {
  let fechaReservada;
  beforeEach(() => {
    // Iniciar sesión antes de cada prueba
    cy.visit('/login');
    cy.get('#correo').type('misancio@javerianacali.edu.co');
    cy.get('#password').type('12345678');
    cy.get('button[type="submit"]').click();
    
    // Verificar inicio de sesión exitoso
    cy.url().should('include', '/AdminMainInterface'); // Asumiendo que se redirige a la página de admin
  });

  function obtenerFechaAleatoriaRestanteMes() {
    // Obtener la fecha actual
    const hoy = new Date();
    
    // Obtener el mes y año actuales
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    
    // Obtener el día siguiente
    const maniana = new Date(hoy);
    maniana.setDate(hoy.getDate() + 1);
    const diaInicio = maniana.getDate();
    
    // Obtener el último día del mes actual
    const ultimoDiaMes = new Date(anioActual, mesActual + 1, 0).getDate();
    
    // Generar un día aleatorio entre el día siguiente y el último día del mes
    const diaAleatorio = Math.floor(Math.random() * (ultimoDiaMes - diaInicio + 1)) + diaInicio;
    
    // Crear la fecha resultante
    const fechaAleatoria = new Date(anioActual, mesActual, diaAleatorio);
    
    // Formatear la fecha como YYYY-MM-DD
    const fechaFormateada = fechaAleatoria.toISOString().split('T')[0];
    
    return fechaFormateada;
  }

  it('Escenario 1: Reserva exitosa cuando el dron está disponible', () => {
    // Paso 1: Navegar a la sección de reserva
    cy.get('.admin-card').contains('Reservar Dispositivo').click();
    cy.url().should('include', '/ReservarDispositivo');
    
    // Paso 2: Seleccionar Dron necesario
    cy.get('.dispositivo-card').first().within(() => {
      cy.contains('button', 'Reservar').click();
    });
    cy.url().should('include', '/FormularioReserva');
    
    // Paso 3: Poner Ciudad
    cy.get('#ciudad').type('Cali');
    
    // Paso 4: Poner fecha
    // Obtener fecha de mañana en formato YYYY-MM-DD

    
    fechaReservada = obtenerFechaAleatoriaRestanteMes();
    cy.get('#fechaReserva').type(fechaReservada, {delay: 100});
    
    // Paso 5: Confirmar reserva
    cy.intercept('POST', 'http://localhost:8081/reservar', (req) => {
      // Agregar un identificador único para evitar duplicados
      req.headers['x-test-id'] = 'cypress-test-' + Date.now();
    }).as('reservaRequest');

    cy.wait(500);

    cy.get('button[type="submit"]').should('be.visible').click({force: true});
    
    // Verificar que la solicitud fue exitosa
    cy.wait('@reservaRequest').its('response.statusCode').should('eq', 200);
    
    // Verificar mensaje de éxito
    cy.on('window:alert', (text) => {
      expect(text).to.include('exitosamente');
    });
  });

  it('Escenario 2: Error cuando el dron no está disponible en la fecha seleccionada', () => {
    // Paso 1: Navegar a la sección de reserva
    cy.get('.admin-card').contains('Reservar Dispositivo').click();
    
    // Paso 2: Seleccionar el primer dron (que está disponible en la lista)
    cy.get('.dispositivo-card').first().within(() => {
      cy.contains('button', 'Reservar').click();
    });
    
    // Verificar que navegamos al formulario
    cy.url().should('include', '/FormularioReserva');
    
    // Paso 3: Poner Ciudad
    cy.get('#ciudad').type('Cali');
    
    // Paso 4: Poner fecha
    // Usar la misma función para generar fecha aleatoria
    cy.get('#fechaReserva').type(fechaReservada, {delay: 100});
    
    // Interceptar la solicitud POST de reserva para simular un error
    cy.intercept('POST', 'http://localhost:8081/reservar', {
      statusCode: 400,
      body: {
        error: true,
        message: 'El dispositivo ya está reservado para esta fecha'
      }
    }).as('reservaRequestError');
    
    // Paso 5: Intentar confirmar la reserva
    cy.wait(500);
    cy.get('button[type="submit"]').should('be.visible').click({force: true});
    
    // Verificar que la solicitud falló como se esperaba
    cy.wait('@reservaRequestError').then((interception) => {
      // Verificar el código de estado
      expect(interception.response.statusCode).to.eq(400);
      
      // Verificar el mensaje de error en el cuerpo de la respuesta
      expect(interception.response.body.message).to.include('El dispositivo ya está reservado');
      
      // Verificar el atributo error
      expect(interception.response.body.error).to.be.true;
    });
    
    // También podemos verificar cómo el frontend maneja este error
    // Por ejemplo, verificando si el botón de enviar se habilita nuevamente
    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('Escenario 3: Validación de condiciones climáticas adversas', () => {
    // Interceptar llamada a API de clima ANTES de navegar
    cy.intercept('GET', /api\.openweathermap\.org\/data/, {
      statusCode: 200,
      body: {
        cod: 200,
        weather: [
          { description: 'overcast clouds' }
        ]
      }
    }).as('weatherRequest');
    
    // Paso 1: Navegar a la sección de reserva
    cy.get('.admin-card').contains('Reservar Dispositivo').click();
    
    // Paso 2: Seleccionar Dron necesario (corregido el selector)
    cy.get('.dispositivo-card').first().within(() => {
      cy.contains('button', 'Reservar').click();
    });
    
    // Verificar que navegamos al formulario
    cy.url().should('include', '/FormularioReserva');
    
    // Paso 3: Poner Ciudad con mal clima
    cy.get('#ciudad').type('Bogotá');
    
    // Paso 4: Poner fecha
    cy.get('#fechaReserva').type(obtenerFechaAleatoriaRestanteMes(), {delay: 100});
    
    // Paso 5: Confirmar reserva
    cy.get('button[type="submit"]').click();
    
    // Verificar que se realizó la consulta de clima
    cy.wait('@weatherRequest');
    
    // Verificar mensaje de error por clima
    cy.contains('No puedes realizar la reserva debido a las condiciones climáticas').should('be.visible');
  });
});