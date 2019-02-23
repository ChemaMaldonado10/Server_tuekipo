const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcryptjs')
const mdAuth = require('../middlewares/auth')

const router = express.Router()

// List all entities
router.get("/entities/:desde/:hasta", (req, res) => {
    const conn = getConnection()
    const desde = Number(req.params.desde);
    const hasta = Number(req.params.hasta);
    const sql = "SELECT * FROM entidades_deportivas LIMIT ?,? ";
    const sql_conteo = "SELECT COUNT(id_entidad) AS count FROM entidades_deportivas";

    conn.query(sql_conteo, (err, rows, fields) => {
        if (err) {
            console.log(err)
        } else {
            console.log(rows[0].count)
        }
        total = rows[0].count;
    });
    conn.query(sql, [desde, hasta], (err, rows, fields) => {
        if (err) {
            res.status(500).json({
                state: "false",
                message: "Can´t fetch entities",
            });
            console.log(err)
        } else {
            res.status(200).json({
                state: "true",
                entidades: rows,
                total: total
            });
        }
    })
})

// ------------------------------------------------------------------

// Create an entity from a post form html
router.post("/entity/create", (req, res) => {
    console.log("Creating a new entity...")
    const id_entidad = req.body.id_entidad
    const nombre_entidad = req.body.nombre_entidad
    const rol_type = req.body.rol_type
    const email_entidad = req.body.email_entidad
    const password_entidad = bcrypt.hashSync(req.body.password_entidad, 10)

    const sql = " INSERT INTO entidades_deportivas VALUES (?,?,?,?,?)"
    getConnection().query(sql, [id_entidad, nombre_entidad, rol_type, email_entidad, password_entidad], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert entity: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted new entity succesfully", results.insertId)
        res.end()
    })
})

// ------------------------------------------------------------------

// Create an user from a post 
router.post("/entity/create_raw", mdAuth.verificaToken, (req, res) => {
    console.log("Creating a new entity...")
    const id_entidad = req.body.id_entidad
    const nombre_entidad = req.body.nombre_entidad
    const rol_type = req.body.rol_type
    const email_entidad = req.body.email_entidad
    const password_entidad = bcrypt.hashSync(req.body.password_entidad, 10)

    console.log('ok')
    const sql = " INSERT INTO entidades_deportivas VALUES (?,?,?,?,?)"
    getConnection().query(sql, [id_entidad, nombre_entidad, rol_type, email_entidad, password_entidad], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert entity: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted new entity succesfully", results.insertId)
        res.end()
    })
})

// ------------------------------------------------------------------

// Fetch an entity from its id
router.get('/entity/:id', mdAuth.verificaToken, (req, res) => {
    console.log("Fetching entity with id: " + req.params.id)
    const conn = getConnection()
    const userId = req.params.id
    const sql = "SELECT * FROM entidades_deportivas WHERE id_entidad = ?"

    conn.query(sql, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for entity: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching entity..")
        res.json(rows)
    })

})

// ------------------------------------------------------------------

// TODO [PUT]
// Update info of an user. It could be route.put simply changing
// post --> put
// router.post('/update_user', (req, res) => {

//    console.log("Updating user...")
//    const first_name = req.body.first_name
//    const last_name = req.body.last_name
//    const id = req.body.id

//    const sql = " UPDATE users SET first_name = ?, last_name = ? WHERE id = ?"
//    getConnection().query(sql, [first_name, last_name, id], (err, results, fields) => {
//        if (err) {
//            console.log("Failed to insert user: " + err)
//            res.sendStatus(500)
//            return
//        }
//        console.log("Updating user succesfully", results.insertId)
//        res.end()
//    })
// })

// ------------------------------------------------------------------


// TODO [DELETE]
// Delete an user by its id. It could be a route.delete simply changing
// get --> delete
//router.get('/entity/delete/:id', (req, res) => {
//    console.log("Fetching entity with id: " + req.params.id + "to be deleted")
//    const conn = getConnection()
//    const userId = req.params.id
//    const sql = "DELETE FROM entity WHERE entidad = ?"
//
//    conn.query(sql, [userId], (err, rows, fields) => {
//        if (err) {
//            console.log("Failed to delete the entity: " + err)
//            res.sendStatus(500).json
//            return
//        }
//        console.log("Deleting entity..")
//        res.json("Result : deleted")
//    })
//})

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