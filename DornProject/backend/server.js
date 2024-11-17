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

// API para validar usuario y contraseña
app.get('/auth', (req, res) => {
    const sql = "SELECT * FROM Usuario WHERE correoInstitucional = ? AND contraseña = ?";
    db.query(sql, [req.query.correoInstitucional, req.query.contraseña], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data.length > 0); // true if email and password match, false if not
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




//Puts API Calls

//Deletes API Calls


app.listen(8081,() => {
    console.log("Listening ");
})