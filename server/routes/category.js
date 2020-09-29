const express = require('express');

const _ = require('underscore');

const Category = require('../models/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

const app = express();

// Mostrar todas la categorias
app.get('/category', verifyToken, ( req, res ) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec(( err, categories ) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categories,
            });
        });
});

// Mostrar una categoria por ID
app.get('/category/:id', verifyToken, ( req, res ) => {
    const id = req.params.id;

    Category.findById(id)
        .exec(( err, categoryDB ) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if ( !categoryDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es valido'
                    }
                });
            }

            return res.json({
                ok: true,
                category: categoryDB
            });
        });
});

// Crear nueva categoria
app.post('/category', verifyToken, ( req, res ) => {
    const body = req.body;

    const category = new Category({
        description: body.description,
        user: req.user._id,
    });

    category.save(( err, categoryDB ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoryDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            category: categoryDB
        })
    });
});

// Actualiza una categoria
app.put('/category/:id', verifyToken, ( req, res ) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['description']);

    Category.findByIdAndUpdate( id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, categoryDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Elimina una categoria
app.delete('/category/:id', [verifyToken, verifyAdminRole], ( req, res ) => {
    const id = req.params.id;

    Category.findByIdAndRemove( id, { useFindAndModify: false }, (err, categoryDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoryDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        return res.json({
            ok: true,
            message: 'La categoría se ha borrado correctamente',
        });
    });
});

module.exports = app;
