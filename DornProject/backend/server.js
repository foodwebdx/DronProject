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


app.listen(8081,() => {
    console.log("Listening ");
})