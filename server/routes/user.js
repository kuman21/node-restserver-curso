const express = require('express');

const bcrypt = require ('bcrypt');
const _ = require('underscore');

const User = require('../models/user');

const app = express();

app.get('/user', ( req, res ) => {

    const since = Number(req.query.since) || 0;
    const limit = Number(req.query.limit) || 5;

    User.find({ status: true }, 'name email role status google img')
        .skip(since)
        .limit(limit)
        .exec( (err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ status: true }, (err, count) => {
                return res.json({
                    ok: true,
                    users,
                    count
                });
            });
    });
});

app.post('/user', ( req, res ) => {
    const body = req.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    user.save(( err, userDB ) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            user: userDB
        })
    });
});

app.put('/user/:id', ( req, res ) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', ( req, res ) => {
    const id = req.params.id;
    const changeStatus = {
        status: false
    };

    User.findByIdAndUpdate( id, changeStatus, { new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !userDelete ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            user: userDelete
        });
    });
});

module.exports = app;