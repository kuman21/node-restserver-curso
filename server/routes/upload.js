const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');
const product = require('../models/product');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
    const type = req.params.type;
    const id = req.params.id;

    // Valida tipo
    const validType = ['products', 'users'];

    if (validType.indexOf( type ) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + validType.join(', '),
                type
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    const file = req.files.file;
    const arrayFile = file.name.split('.');
    const extension = arrayFile[arrayFile.length - 1];

    // Extensiones permitidas
    const validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf( extension ) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + validExtensions.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre del archivo
    const filename = `${ uniqid(`${ id }-`) }.${ extension }`;

    file.mv(`../uploads/${ type }/${ filename }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aquí, Imagen cargada
        if (type === 'users') {
            userImage( id, res, filename );
        } else {
            productImage(id, res, filename);
        }
        
    });
});

const userImage = (id, res, filename) => {
    User.findById(id, (err, userDB) => {
        if ( err ) {
            deleteFile(filename, 'users');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !userDB ) {
            deleteFile(filename, 'users');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = filename;

        userDB.save((err, userSaved) => {
            return res.json({
                ok: true,
                user: userSaved,
                img: filename
            });
        });
    });
};

const deleteFile = ( filename, type ) => {
    const pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ filename }`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
};

const productImage = (id, res, filename) => {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(filename, 'products');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !productDB ) {
            deleteFile(filename, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = filename;

        productDB.save((err, productSaved) => {
            return res.json({
                ok: true,
                Product: productSaved,
                img: filename
            });
        });
    });
};

module.exports = app;