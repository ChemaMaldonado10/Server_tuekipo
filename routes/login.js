const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var SEED = require('../config/config').SEED
var CLIENT_ID = require('../config/config').CLIENT_ID

const router = express.Router()

//Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// Login route: 
// check if both the email and the password are in the db
router.post('/login', (req, res) => {

    const nombre_entidad = req.body.nombre_entidad;
    const email_entidad = req.body.email_entidad;
    const password_entidad = req.body.password_entidad;

    const sql = "SELECT * FROM entidades_deportivas WHERE email_entidad = '" + email_entidad + "'";

    // Check email and password
    getConnection().query(sql, (err, row, fields) => {
        if (err) throw err;
        if (row.length !== 0) {
            if (bcrypt.compareSync(password_entidad, row[0].password_entidad)) {

                // if everything went great we generate the token!
                row[0].password_entidad = ':)';
                var user_database = row;
                // console.log(user_database)
                var token = jwt.sign({ user_database }, SEED, { expiresIn: 14400 })
                res.status(200).json({
                    state: true,
                    token: token,
                    message: row
                });
            } else {
                return res.status(500).json({
                    state: false,
                    message: "Could not match entity with query --password"
                });
            }
        } else {
            return res.status(500).json({
                state: false,
                message: "Could not match entity with query --email"
            });
        }



    })


});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// Google sign in.  
// TODO: There is a problem with the automatically generated id.
router.post('/login/google/:id', async(req, res) => {

    var id = req.params.id;
    id = Number(id);
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                state: false,
                message: "Token no valido"
            });
        })

    var conn = getConnection();
    console.log(googleUser.email)

    var sql = "SELECT * FROM entidades_deportivas WHERE email_entidad = ? ";

    conn.query(sql, googleUser.email, (err, rows, fields) => {
        if (err) {
            return res.status(500).json({
                state: false,
                message: "No se ha podido realizar la conexion para buscar al usuario"
            });
        }
        if (rows.length !== 0) {
            console.log(rows[0].google)
                // Si no te has autenticado con google, fuera.
            if (rows[0].google === false) {
                return res.status(500).json({
                    state: false,
                    message: "Debe autenticarse de forma normal"
                });
                // Si, si lo has hecho, genero token.
            } else {
                var user_database = rows;
                var token = jwt.sign({ user_database }, SEED, { expiresIn: 14400 })

                res.status(200).json({
                    state: true,
                    message: "only token",
                    usuario: rows,
                    token: token
                });
            }
        } else {
            var sql = "INSERT INTO entidades_deportivas VALUES (?,?,?,?,?,?,?)";

            conn.query(sql, [id, googleUser.nombre, 'ADMIN_ROLE', googleUser.email, ':)', googleUser.img, true], (err, rows, fields) => {
                if (err) {
                    return res.status(500).json({
                        state: false,
                        message: "No se ha podido realizar la conexion para añadir al usuario",
                        error: err
                    });
                } else {
                    var user_database = rows;
                    var token = jwt.sign({ user_database }, SEED, { expiresIn: 14400 })

                    res.status(200).json({
                        state: true,
                        message: "Usuario creado + token",
                        usuario: rows,
                        token: token
                    });
                }
            });
        }
    });
});

// ------------------------------------------------------------------

// We create a pool in order to have a function with all the database
// parameters 

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: 'root',
    password: "mysql191312",
    database: 'beta_tuekipo_2'
})

function getConnection() {
    return pool
}

module.exports = router