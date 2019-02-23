const mysql = require('mysql')
const express = require('express')
const fileUpload = require('express-fileupload');
const path = require('path');
var fs = require('fs');

const router = express.Router()

// Default options
router.use(fileUpload());

// Messages for main http empty route and console.
router.put("/upload/:tipo/:id", (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var validtypes = ['entities', 'narrators', 'analysts'];

    if (validtypes.indexOf(tipo) < 0) {
        return res.status(400).json({
            state: false,
            message: "Tipo de user no valido",
        });
    }

    if (!req.files) {
        return res.status(400).json({
            state: false,
            message: "No img selected",
        });
    }

    // Obtain file name
    var file = req.files.img;
    var splitName = file.name.split('.');
    var extension = splitName[splitName.length - 1];

    // Enabled extensions
    var enabledExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    if (enabledExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            state: false,
            message: "Invalid extension",
            errors: { message: "Valid extensions are " + enabledExtensions.join(',') }
        });
    }
    // Personalized file name
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${extension}`;

    // Move file from temporal to an specific path
    var path = `./uploads/${ tipo }/${fileName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(400).json({
                state: false,
                message: "Error while moving file",
                errors: err
            });
        }
        uploadByType(tipo, id, fileName, res);
    })
})

function uploadByType(tipo, id, fileName, res) {
    if (tipo === 'entities') {
        id = Number(id);
        var oldPath = "";
        var conn = getConnection();
        var resultHandler = function(err) {
            if (err) {
                console.log("unlink failed", err);
            } else {
                console.log("file deleted");
            }
        }

        const sql_obtain_img = "SELECT img FROM entidades_deportivas WHERE id_entidad = ?";

        conn.query(sql_obtain_img, [id], (err, rows, fields) => {
            if (err) throw err;
            if (rows.length !== 0) {
                oldPath = './uploads/entities/' + rows[0].img;
                console.log(oldPath)
            } else {
                console.log('No img in database')
            }
        });

        const sql = "UPDATE entidades_deportivas SET img = ? WHERE id_entidad = ? ";

        conn.query(sql, [fileName, id], (err, rows, fields) => {
            if (err) {
                res.status(500).json({
                    state: false,
                    message: "Cant upload img to table",
                    error: err
                });
                console.log(err);
            } else {
                if (oldPath != null) {
                    fs.unlink(oldPath, resultHandler);
                }
                res.status(200).json({
                    state: true,
                    message: "img upload and up-to-date",
                });
            }
        })

    }
    // if (tipo === 'analyst') {

    // }
    // if (tipo === 'narrator') {

    // }
}


router.get("/obtain_img/entities/:id", (req, res) => {
    var conn = getConnection();
    id = req.params.id;
    id = Number(id);
    var img = "";

    sql = "SELECT img FROM entidades_deportivas WHERE id_entidad = ?";

    conn.query(sql, id, (err, rows, fields) => {
        if (err) {
            return res.status(500).json({
                state: false,
                message: "cant connect",
            });
        } else {
            if (rows.length !== 0) {
                img = rows[0].img;
            } else {
                return res.status(500).json({
                    state: false,
                    message: "No img in database according to id",
                });
            }
        }
        var relative_path = `../uploads/entities/${img}`;
        var absolute_path = path.resolve(__dirname, relative_path);

        if (fs.existsSync(absolute_path)) {
            res.sendFile(absolute_path);
        } else {
            var relative_path = `../assets/no-img.jpg`;
            var absolute_path = path.resolve(__dirname, relative_path);
            res.sendFile(absolute_path);
        }
    });
});

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