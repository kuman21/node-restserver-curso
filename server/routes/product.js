const express = require('express');

const Product = require('../models/product');
const { verifyToken } = require('../middlewares/auth');

const app = express();

// Listar todos los productos
app.get('/product', verifyToken, ( req, res ) => {
    const since = Number(req.query.since) || 0;
    const limit = Number(req.query.limit) || 5;

    Product.find({ available: true })
        .skip(since)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec(( err, products ) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                products
            })
        });
});

// Obtener producto por id
app.get('/product/:id', verifyToken, ( req, res ) => {
    const id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec(( err, productDB ) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if ( !productDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            return res.json({
                ok: true,
                product: productDB
            });
        });
});

// Buscar productos
app.get('/products/search/:term', verifyToken, (req, res) => {
    const term = req.params.term;

    const regex = new RegExp(term, 'i');
    
    Product.find({ name: regex })
        .populate('category', 'description')
        .exec( (err, products) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });
        });
});

// Crea un nuevo producto
app.post('/product', verifyToken, ( req, res ) => {
    const body = req.body;

    const product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id,
    });

    product.save(( err, productDB ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            product: productDB
        })
    });
});

// Actualizar un producto
app.put('/product/:id', verifyToken, ( req, res ) => {
    const id = req.params.id;
    const body = req.body;

    Product.findByIdAndUpdate( id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, productDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        return res.json({
            ok: true,
            product: productDB
        });
    });
});

// Eliminar un producto
app.delete('/product/:id', verifyToken, ( req, res ) => {
    const id = req.params.id;
    const changeStatus = {
        available: false
    };

    Product.findByIdAndUpdate( id, changeStatus, { new: true, useFindAndModify: false }, (err, productDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            product: productDB,
            message: 'El producto se ha borrado'
        });
    });
});

module.exports = app;
