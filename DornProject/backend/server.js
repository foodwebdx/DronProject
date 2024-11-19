const exppress = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = exppress();
app.use(exppress.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "drones"
})

//When creating API Calls, order is {Post, Get, Puts, Deletes}
//Post API Calls

app.post("/createUser", (req, res) => {
    const sql = "INSERT INTO `Usuario` (`nombreCompleto`, `correoInstitucional`, `contraseña`, `rol`, `numeroContacto`) VALUES (?)";
    const values = [
        req.body.nombreCompleto,
        req.body.correoInstitucional,
        req.body.contraseña,
        req.body.rol,
        req.body.numeroContacto
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err); // Muestra el error en la consola
            return res.json("Error");
        }
        return res.json("data se mando de manera exitosa");
    });
});


// API para realizar una reserva
app.post("/reservarDispositivo", (req, res) => {
    const sql = "INSERT INTO `Reserva` (`idUsuario`, `idDispositivo`) VALUES (?)";
    const values = [
        req.body.idUsuario,    // ID del usuario que realiza la reserva
        req.body.idDispositivo // ID del dispositivo reservado
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.json("Error al realizar la reserva");
        }
        return res.json("Reserva realizada exitosamente");
    });
});

app.post('/reservar', (req, res) => {
    const { idDispositivo, correoInstitucional, fechaReserva } = req.body;

    // Obtener el idUsuario basado en el correoInstitucional
    const userQuery = "SELECT idUsuario FROM Usuario WHERE correoInstitucional = ?";
    db.query(userQuery, [correoInstitucional], (err, userResults) => {
        if (err) {
            console.error("Error al obtener el ID del usuario:", err);
            return res.status(500).json({ message: "Error al obtener el ID del usuario" });
        }

        if (userResults.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const idUsuario = userResults[0].idUsuario;

        // Verificar si el dispositivo ya está reservado en esa fecha
        const checkQuery = `
            SELECT * 
            FROM Reserva
            WHERE idDispositivo = ? AND fechaReserva = ?
        `;
        db.query(checkQuery, [idDispositivo, fechaReserva], (err, results) => {
            if (err) {
                console.error("Error al verificar disponibilidad:", err);
                return res.status(500).json({ message: "Error al verificar la disponibilidad del dispositivo" });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "El dispositivo ya está reservado para esa fecha" });
            }

            // Si está disponible, registrar la reserva
            const logQuery = `
                INSERT INTO Reserva (idDispositivo, idUsuario, fechaReserva) 
                VALUES (?, ?, ?)
            `;
            db.query(logQuery, [idDispositivo, idUsuario, fechaReserva], (err) => {
                if (err) {
                    console.error("Error al registrar la reserva:", err);
                    return res.status(500).json({ message: "Error al registrar la reserva" });
                }

                // Actualizar el estado del dispositivo a 'Reservado'
                const updateQuery = "UPDATE Dispositivo SET estado = 'FueraDeServicio' WHERE idDispositivo = ?";
                db.query(updateQuery, [idDispositivo], (err) => {
                    if (err) {
                        console.error("Error al actualizar el estado del dispositivo:", err);
                        return res.status(500).json({ message: "Error al actualizar el estado del dispositivo" });
                    }

                    res.status(200).json({ message: "Reserva realizada exitosamente" });
                });
            });
        });
    });
});



// API para añadir una notificacion
app.post("/notif", (req, res) => {
    const sql = "INSERT INTO `Notificaciones` (`mensaje`, `correoInstitucional`) VALUES (?)";
    const values = [
        req.body.mensaje,
        req.body.correoInstitucional
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err); // Muestra el error en la consola
            return res.json("Error");
        }
        return res.json("data se mando de manera exitosa");
    });
});

app.post("/createDispositivo", (req, res) => {
    const sql = "INSERT INTO `Dispositivo` (`nombre`, `tipo`, `estado`, `ubicacion`, `nivelBateria`, `tiempoUsoTotal`, `fechaUltimaActividad`, `capacidadCarga`) VALUES (?)";
    const values = [
        req.body.nombre,
        req.body.tipo,
        req.body.estado,
        req.body.ubicacion,
        req.body.nivelBateria,
        req.body.tiempoUsoTotal,
        req.body.fechaUltimaActividad,
        req.body.capacidadCarga
    ];
    
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err); // Muestra el error en la consola para depuración
            return res.json("Error al insertar el dispositivo.");
        }
        return res.json("El dispositivo se creó exitosamente.");
    });
});


//Get API CALLS
// API para validar usuario existe
app.get('/mailExists', (req, res) => {
    const sql = "SELECT * FROM Usuario WHERE correoInstitucional = ?";
    db.query(sql, [req.query.correoInstitucional], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data.length > 0); // true if email found, false if not
    });
});

app.get('/auth', (req, res) => {
    const sql = "SELECT rol FROM Usuario WHERE correoInstitucional = ? AND contraseña = ?";
    db.query(sql, [req.query.correoInstitucional, req.query.contraseña], (err, data) => {
        if (err) {
            return res.json({ success: false, message: "Error del servidor" });
        }
        if (data.length > 0) {
            return res.json({ success: true, rol: data[0].rol }); // Devuelve el rol si coincide
        } else {
            return res.json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});


app.get('/readDispositivo', (req, res) => {
    // Consulta SQL para obtener todos los dispositivos
    const sql = `
        SELECT 
            idDispositivo, 
            nombre, 
            estado, 
            ubicacion, 
            fechaUltimaActividad 
        FROM Dispositivo`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener los dispositivos:', err);
            res.status(500).json({ error: 'Error al obtener los dispositivos' });
        } else if (result.length === 0) {
            res.status(404).json({ error: 'No se encontraron dispositivos' });
        } else {
            res.json(result);
        }
    });
});

app.get('/dispositivoInfo/:idDispositivo', (req, res) => {
    const idDispositivo = req.params.idDispositivo;
    
    const sql = "SELECT idDispositivo, nombre, tipo, estado, ubicacion, nivelBateria, tiempoUsoTotal, fechaUltimaActividad, capacidadCarga FROM Dispositivo WHERE idDispositivo = ?";
    
    db.query(sql, [idDispositivo], (err, data) => {
        if (err) {
            console.error(err);
            return res.json("Error");
        }

        if (data.length === 0) {
            return res.json({ message: "Dispositivo no encontrado" });
        }

        return res.json(data[0]);
    });
});

app.get('/NotificacionesYalertas', (req, res) => {
    const query = 'SELECT idNotificacion, mensaje, correoInstitucional FROM notificaciones ORDER BY idNotificacion DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener notificaciones:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results); // Envía las notificaciones en formato JSON
        }
    });
});

app.delete('/borrar/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM notificaciones WHERE idNotificacion = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la notificación:', err);
            res.status(500).send('Error al eliminar la notificación.');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No se encontró la notificación con el ID especificado.');
        } else {
            res.status(200).send('Notificación eliminada exitosamente.');
        }
    });
});

//Puts API Calls

//Deletes API Calls

app.get('/dispositivos', (req, res) => {
    const sql = "SELECT idDispositivo, nombre, tipo, estado FROM Dispositivo";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error al obtener dispositivos:", err);
            return res.status(500).json({ error: "Error al obtener dispositivos" });
        }
        res.json(data);
    });
});

app.listen(8081,() => {
    console.log("Listening ");
})