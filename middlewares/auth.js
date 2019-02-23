const jwt = require('jsonwebtoken')
var SEED = require('../config/config').SEED

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    console.log('im here')
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                state: false,
                message: 'Incorrect Token',
                errors: err
            });
        } else {
            req.usuario = decoded.usuario;
            next();
            // res.status(200).json({
            //     state: true,
            //     decoded: decoded
            // });
        }
    })
}