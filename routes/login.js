const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var SEED = require('../config/config').SEED

const router = express.Router()

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