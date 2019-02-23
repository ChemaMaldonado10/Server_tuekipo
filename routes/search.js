const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcryptjs')
const mdAuth = require('../middlewares/auth')

const router = express.Router()

// Search for all analyst associate with an specific entity
router.get("/search/analyst/:name_entity/", (req, res) => {

    conn = getConnection();
    const name_entity = req.params.name_entity;

    const sql = "SELECT nombre_usuario FROM usuarios LEFT JOIN entidades_deportivas ON usuarios.entidades_deportivas_id_entidad = entidades_deportivas.id_entidad WHERE tipo_usuario='Analista' AND nombre_entidad = ? ";

    conn.query(sql, [name_entity], (err, rows, fields) => {
        if (err) {
            res.status(500).json({
                state: "false",
                message: "Can´t fetch analyst user name",
            });
            console.log(err)
        } else {
            res.status(200).json({
                state: "true",
                nombre_usuarios: rows
            });
        }

    });
});

// Search for all narrators associate with an specific entity
router.get("/search/narrator/:name_entity/", (req, res) => {

    conn = getConnection();
    const name_entity = String(req.params.name_entity)

    const sql = "SELECT nombre_usuario FROM usuarios LEFT JOIN entidades_deportivas ON usuarios.entidades_deportivas_id_entidad = entidades_deportivas.id_entidad WHERE tipo_usuario='Narrador' AND nombre_entidad = ? ";

    conn.query(sql, [name_entity], (err, rows, fields) => {
        if (err) {
            res.status(500).json({
                state: "false",
                message: "Can´t fetch narrator user name",
            });
            console.log(err)
        } else {
            res.status(200).json({
                state: "true",
                nombre_usuarios: rows
            });
        }

    });
});

// Search analyst user_name associate with an specific entity by part of its name
router.get("/search/analyst/:name_entity/:name_usuario/", (req, res) => {

    conn = getConnection();
    const name_usuario = String(req.params.name_usuario)
    const name_entity = String(req.params.name_entity)

    const sql = "SELECT nombre_usuario FROM usuarios LEFT JOIN entidades_deportivas ON usuarios.entidades_deportivas_id_entidad = entidades_deportivas.id_entidad WHERE tipo_usuario = 'Analista' AND nombre_entidad= ? AND nombre_usuario LIKE '%" + name_usuario + "%' ";

    conn.query(sql, [name_entity, name_usuario], (err, rows, fields) => {
        if (err) {
            res.status(500).json({
                state: "false",
                message: "Can´t fetch narrator user name",
            });
            console.log(err)
        } else {
            res.status(200).json({
                state: "true",
                nombre_usuarios: rows
            });
        }

    });
});

// Search narrators user_name associate with an specific entity by part of its name
router.get("/search/narrator/:name_entity/:name_usuario/", (req, res) => {

    conn = getConnection();
    const name_usuario = String(req.params.name_usuario)
    const name_entity = String(req.params.name_entity)

    const sql = "SELECT nombre_usuario FROM usuarios LEFT JOIN entidades_deportivas ON usuarios.entidades_deportivas_id_entidad = entidades_deportivas.id_entidad WHERE tipo_usuario = 'Narrador' AND nombre_entidad= ? AND nombre_usuario LIKE '%" + name_usuario + "%' ";

    conn.query(sql, [name_entity, name_usuario], (err, rows, fields) => {
        if (err) {
            res.status(500).json({
                state: "false",
                message: "Can´t fetch narrator user name",
            });
            console.log(err)
        } else {
            res.status(200).json({
                state: "true",
                nombre_usuarios: rows
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