describe('TC-003: Validación del Sistema de Creación de Usuarios', () => {
  beforeEach(() => {
    // Iniciar sesión antes de cada prueba con usuario admin
    cy.visit('/login');
    cy.get('#correo').type('misancio@javerianacali.edu.co');
    cy.get('#password').type('12345678');
    cy.get('button[type="submit"]').click();
    
    // Verificar inicio de sesión exitoso
    cy.url().should('include', '/AdminMainInterface');
    
    // Navegar a la sección de gestión de usuarios
    cy.get('.admin-card').contains('Gestión de Usuarios').click();
    
    // Verificar que estamos en el formulario correcto
    cy.url().should('include', '/CreateUser');
  });

  it('Test Case 1: Validar creación exitosa de un nuevo usuario con datos válidos', () => {
    // Ingresar datos del usuario
    cy.get('#firstName').type('Juan');
    cy.get('#lastName1').type('Pérez');
    cy.get('#lastName2').type('Ramírez');
    cy.get('#email').type('juan.perez@javerianacali.edu.co');
    cy.get('#password').type('Admin1234');
    cy.get('#rol').then($select => {
      if ($select.length) {
        cy.get('#rol').select('Administrador');
      } else {
        // Intentar con otros posibles selectores
        cy.get('[name="rol"]').select('Administrador').if('not.exist', () => {
          cy.get('select').contains('Administrador').click().if('not.exist', () => {
            // Si es un elemento personalizado (no un select nativo)
            cy.contains('label', 'Rol').parent().contains('Administrador').click({force: true});
          });
        });
      }
    });

    cy.get('#contactNumber').type('3001234567');
    
    // Interceptar la solicitud POST para crear usuario
    cy.intercept('POST', 'http://localhost:8081/createUser').as('createUser');
    
    // Hacer clic en el botón Enviar
    cy.get('button[type="submit"]').click();
    
    // Verificar que la solicitud fue exitosa
    cy.wait('@createUser').its('response.statusCode').should('eq', 200);
    
    // Verificar redirección al menú principal
    cy.url().should('include', '/MainPage');
  });

  it('Test Case 2: Validar rechazo del formulario si el correo no contiene javerianacali.edu.co', () => {
    // Ingresar datos del usuario
    cy.get('#firstName').type('Juan');
    cy.get('#lastName1').type('Pérez');
    cy.get('#lastName2').type('Ramírez');
    cy.get('#email').type('test@gmail.com'); // Correo inválido
    cy.get('#password').type('Admin1234');
    cy.get('#rol').then($select => {
      if ($select.length) {
        cy.get('#rol').select('Administrador');
      } else {
        // Intentar con otros posibles selectores
        cy.get('[name="rol"]').select('Administrador').if('not.exist', () => {
          cy.get('select').contains('Administrador').click().if('not.exist', () => {
            // Si es un elemento personalizado (no un select nativo)
            cy.contains('label', 'Rol').parent().contains('Administrador').click({force: true});
          });
        });
      }
    });
    cy.get('#contactNumber').type('3001234567');
    
    cy.on('window:alert', (text) => {
      expect(text).to.include('Email must include @javerianacali.edu.co');
    });

    // Hacer clic en el botón Enviar
    cy.get('button[type="submit"]').click();
    
    // Verificar que seguimos en la misma página del formulario
    cy.url().should('include', '/CreateUser');
  });

  it('Test Case 3: Validar que el sistema rechace contraseñas con menos de 8 caracteres', () => {
    // Ingresar datos del usuario
    cy.get('#firstName').type('Juan');
    cy.get('#lastName1').type('Pérez');
    cy.get('#lastName2').type('Ramírez');
    cy.get('#email').type('juan.perez@javerianacali.edu.co');
    cy.get('#password').type('123'); // Contraseña inválida
    cy.get('#rol').then($select => {
      if ($select.length) {
        cy.get('#rol').select('Administrador');
      } else {
        // Intentar con otros posibles selectores
        cy.get('[name="rol"]').select('Administrador').if('not.exist', () => {
          cy.get('select').contains('Administrador').click().if('not.exist', () => {
            // Si es un elemento personalizado (no un select nativo)
            cy.contains('label', 'Rol').parent().contains('Administrador').click({force: true});
          });
        });
      }
    });
    cy.get('#contactNumber').type('3001234567');
    
    cy.on('window:alert', (text) => {
      expect(text).to.include('Password must be between 8 and 20 characters');
    });

    // Hacer clic en el botón Enviar
    cy.get('button[type="submit"]').click();
    
    // Verificar que seguimos en la misma página del formulario
    cy.url().should('include', '/CreateUser');
  });

  it('Test Case 4: Validar que el sistema rechace el envío si no se selecciona un rol válido', () => {
    // Ingresar datos del usuario
    cy.get('#firstName').type('Juan');
    cy.get('#lastName1').type('Pérez');
    cy.get('#lastName2').type('Ramírez');
    cy.get('#email').type('juan.perez@javerianacali.edu.co');
    cy.get('#password').type('Admin1234');
    // No seleccionar rol
    cy.get('#contactNumber').type('3001234567');
    
    cy.on('window:alert', (text) => {
      expect(text).to.include('Role must be Admin or Usuario');
    });

    // Hacer clic en el botón Enviar
    cy.get('button[type="submit"]').click();
    
    // Verificar que seguimos en la misma página del formulario
    cy.url().should('include', '/CreateUser');
  });
});