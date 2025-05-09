describe('TC-002: Validación del Sistema de Creación de Dispositivos', () => {
  beforeEach(() => {
    // Iniciar sesión antes de cada prueba con usuario admin
    cy.visit('/login');
    cy.get('#correo').type('misan@javerianacali.edu.co');
    cy.get('#password').type('12345678');
    cy.get('button[type="submit"]').click();
    
    // Verificar inicio de sesión exitoso
    cy.url().should('include', '/Sidebar');
    
    // Navegar a la sección de gestión de usuarios donde está la opción para crear dispositivo
    cy.get('.sidebar-menu');
    
    // Navegar al formulario de creación de dispositivo
    cy.contains('Crear Dispositivo').click();
    
    // Verificar que estamos en el formulario correcto
    cy.url().should('include', '/dispositivos');
  });

  it('Escenario 1: Ingresar datos válidos para crear dispositivo exitosamente', () => {

    cy.get('.buttons-container');

    cy.contains('Add +').click({ force: true });

    // Completar todos los campos con valores válidos
    cy.get('#nombre').type('RobotX');
    cy.get('#tipo').select('Aereo');
    cy.get('#estado').select('Disponible');
    cy.get('#ubicacion').type('Zona A');
    cy.get('#nivelBateria').type('50');
    cy.get('#tiempoUsoTotal').type('10');
    
    // Formato de fecha YYYY-MM-DD
    cy.get('#fechaUltimaActividad').type('2025-04-01');
    cy.get('#capacidadCarga').select('1');
    
    // Interceptar la solicitud POST para crear dispositivo
    cy.intercept('POST', 'http://localhost:8081/createDispositivo').as('createDevice');
    
    // Hacer clic en el botón Submit
    cy.get('button[type="submit"]').click();
    
    cy.wait('@createDevice').then((interception) => {
      // Verificar el código de estado
      expect(interception.response.statusCode).to.eq(200);
      
      // Verificar que el mensaje de éxito está en la respuesta
      expect(interception.response.body).to.include('exitosamente');
    });
    
    // Verificar redirección al Sidebar después de crear el dispositivo
    cy.url().should('include', '/Sidebar');
  });

  it('Escenario 2: Dejar el campo nombre vacío y verificar validación', () => {
    cy.get('.buttons-container');

    cy.contains('Add +').click({ force: true });

    // Dejar el nombre vacío
    cy.get('#nombre').clear();
    
    // Completar el resto de los campos correctamente
    cy.get('#tipo').select('Aereo');
    cy.get('#estado').select('Disponible');
    cy.get('#ubicacion').type('Zona A');
    cy.get('#nivelBateria').type('50');
    cy.get('#tiempoUsoTotal').type('10');
    cy.get('#fechaUltimaActividad').type('2025-04-01');
    cy.get('#capacidadCarga').select('1');
    
    // Hacer clic en el botón Submit
    cy.get('button[type="submit"]').click();
    
    // Verificar que aparece el mensaje de error
    cy.contains('Please fill in all the fields').should('be.visible');
    
    // Verificar que seguimos en la misma página del formulario
    cy.url().should('include', '/createDispositivo');
  });

  it('Escenario 3: Verificar validación cuando el nivel de batería es inválido', () => {
    cy.get('.buttons-container');

    cy.contains('Add +').click({ force: true });

    // Completar todos los campos con valores válidos excepto nivel de batería
    cy.get('#nombre').type('RobotX');
    cy.get('#tipo').select('Aereo');
    cy.get('#estado').select('Disponible');
    cy.get('#ubicacion').type('Zona A');
    cy.get('#nivelBateria').type('-5'); // Valor inválido
    cy.get('#tiempoUsoTotal').type('10');
    cy.get('#fechaUltimaActividad').type('2025-04-01');
    cy.get('#capacidadCarga').select('1');
    
    // Hacer clic en el botón Submit
    cy.get('button[type="submit"]').click();
    
    // Verificar que aparece el mensaje de error específico para el nivel de batería
    cy.contains('Battery level must be between 0 and 100').should('be.visible');
    
    // Verificar que no se realizó la petición al servidor o que fue rechazada
    // y que seguimos en la misma página del formulario
    cy.url().should('include', '/createDispositivo');
  });

  it('Escenario 4: Verificar validación cuando el Tiempo de uso es inválido', () => {
    cy.get('.buttons-container');

    cy.contains('Add +').click({ force: true });

    // Completar todos los campos con valores válidos excepto nivel de batería
    cy.get('#nombre').type('RobotX');
    cy.get('#tipo').select('Aereo');
    cy.get('#estado').select('Disponible');
    cy.get('#ubicacion').type('Zona A');
    cy.get('#nivelBateria').type('3'); // Valor inválido
    cy.get('#tiempoUsoTotal').type('0');
    cy.get('#fechaUltimaActividad').type('2025-04-01');
    cy.get('#capacidadCarga').select('1');
    
    // Hacer clic en el botón Submit
    cy.get('button[type="submit"]').click();
    
    // Verificar que aparece el mensaje de error específico para el nivel de batería
    cy.contains('Total usage time must be a positive number').should('be.visible');
    
    // Verificar que no se realizó la petición al servidor o que fue rechazada
    // y que seguimos en la misma página del formulario
    cy.url().should('include', '/createDispositivo');
  });
});