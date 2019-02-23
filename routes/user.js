const mysql = require('mysql')
const express = require('express')
const mdAuth = require('../middlewares/auth')

const router = express.Router()
    // ------------------------------------------------------------------

// Create an user from a post form html
router.post("/user/create", (req, res) => {
    console.log("Creating a new user...")
    const id_usuario = req.body.id_usuario
    const id_entidad = req.body.id_entidad
    const nombre_usuario = req.body.nombre_usuario
    const tipo_usuario = req.body.tipo_usuario
    const email_usuario = req.body.email_usuario
    const password_usuario = req.body.password_usuario
    const rol_type = req.body.rol_type

    const sql = " INSERT INTO usuarios VALUES (?,?,?,?,?,?,?)"
    getConnection().query(sql, [id_usuario, id_entidad, nombre_usuario, tipo_usuario, email_usuario, password_usuario, rol_type], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert user: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted new user succesfully", results.insertId)
        res.end()
    })
})

// ------------------------------------------------------------------

// Create an user from a post 
router.post("/user/create_raw", (req, res) => {
    console.log("Creating a new user...")

    const id_usuario = req.body.id_usuario
    const id_entidad = req.body.id_entidad
    const nombre_usuario = req.body.nombre_usuario
    const tipo_usuario = req.body.tipo_usuario
    const email_usuario = req.body.email_usuario
    const password_usuario = req.body.password_usuario
    const rol_type = req.body.rol_type

    const sql = " INSERT INTO usuarios VALUES (?,?,?,?,?,?,?)"
    getConnection().query(sql, [id_usuario, id_entidad, nombre_usuario, tipo_usuario, email_usuario, password_usuario, rol_type], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert user: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted new user succesfully", results.insertId)
        res.end()
    })
})

// ------------------------------------------------------------------

// List all users
// by 'all' I mean: internals, externals, analysts and narrators.
router.get("/users", (req, res) => {
    const conn = getConnection()
    const sql = "SELECT * FROM usuarios"

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log("Failed to fetch for users: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching users...")
        res.json(rows)
    })
})

// ------------------------------------------------------------------

// Lists all analyst users
router.get("/users/analyst", (req, res) => {
    const conn = getConnection()
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, tipo_usuario FROM usuarios WHERE tipo_usuario='Analista'"

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log("Failed to fetch for users: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching users...")
        res.json(rows)
    })
})

// Lists all analyst users by its entity
router.get("/users/analyst/:entity_name", (req, res) => {
    const conn = getConnection()
    const entity_name = req.params.entity_name
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, nombre_entidad FROM usuarios LEFT JOIN entidades_deportivas ON usuarios.entidades_deportivas_id_entidad = entidades_deportivas.id_entidad WHERE tipo_usuario='Analista' AND nombre_entidad = ? "

    conn.query(sql, entity_name, (err, rows, fields) => {
        if (err) {
            console.log("Failed to fetch for users: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching users...")
        res.json(rows)
    })
})

// ------------------------------------------------------------------

// Lists all narrators users
router.get("/users/narrator", (req, res) => {
    const conn = getConnection()
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, tipo_usuario FROM usuarios WHERE tipo_usuario='Narrador'"

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log("Failed to fetch for users: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching users...")
        res.json(rows)
    })
})

// Lists all narrators users by its entity
router.get("/users/narrator/:entity_name", (req, res) => {
    const conn = getConnection()
    const entity_name = req.params.entity_name
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, nombre_entidad FROM usuarios LEFT JOIN entidades_deportivas ON usuarios.entidades_deportivas_id_entidad = entidades_deportivas.id_entidad WHERE tipo_usuario='Narrador' AND nombre_entidad = ? "

    conn.query(sql, entity_name, (err, rows, fields) => {
        if (err) {
            console.log("Failed to fetch for users: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching users...")
        res.json(rows)
    })
})

// ------------------------------------------------------------------

// Fetch an user from its id
router.get('/user/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)
    const conn = getConnection()
    const userId = req.params.id
    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?"

    conn.query(sql, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Fetching user..")
        res.json(rows)
    })

})

// ------------------------------------------------------------------

// TODO
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

// Delete an user by its id. It could be a route.delete simply changing
// get --> delete
router.get('/user/delete/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id + "to be deleted")
    const conn = getConnection()
    const userId = req.params.id
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?"

    conn.query(sql, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to delete the user: " + err)
            res.sendStatus(500).json
            return
        }
        console.log("Deleting user..")
        res.json("Result : deleted")
    })
})

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