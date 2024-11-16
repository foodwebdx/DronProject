CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombreCompleto VARCHAR(50) NOT NULL,
    correoInstitucional VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(20) NOT NULL CHECK (CHAR_LENGTH(contraseña) BETWEEN 8 AND 20),
    rol ENUM('Usuario', 'Administrador') NOT NULL,
    numeroContacto VARCHAR(15)
);

CREATE TABLE Dispositivo (
    idDispositivo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    tipo ENUM('Aereo', 'Terrestre') NOT NULL,
    estado ENUM('Disponible', 'EnReparacion', 'FueraDeServicio') NOT NULL,
    ubicacion VARCHAR(100),
    nivelBateria INT,
    tiempoUsoTotal INT,
    fechaUltimaActividad DATE,
    capacidadCarga DECIMAL(2, 1) NOT NULL CHECK (capacidadCarga IN (0.5, 1))

);

CREATE TABLE Reserva (
    idReserva INT PRIMARY KEY AUTO_INCREMENT,
    fechaReserva DATE NOT NULL,
    idUsuario INT,
    idDispositivo INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idDispositivo) REFERENCES Dispositivo(idDispositivo) ON DELETE CASCADE
);

CREATE TABLE Servicio (
    idServicio INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255),
    idDispositivo INT,
    FOREIGN KEY (idDispositivo) REFERENCES Dispositivo(idDispositivo) ON DELETE CASCADE
);