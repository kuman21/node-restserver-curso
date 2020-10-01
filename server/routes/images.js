const express = require('express');

const { verifyTokenImg } = require('../middlewares/auth');

const fs = require('fs');
const path = require('path');

const app = express();

app.get('/image/:type/:img', verifyTokenImg, (req, res) => {
    const type = req.params.type;
    const img = req.params.img;

    const pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;