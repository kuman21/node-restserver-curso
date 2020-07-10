const jwt = require('jsonwebtoken');

const verifyToken = ( req, res, next ) => {
    const token = req.get('Authorization');

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.user = decoded.user;
        next();
    });
};

const verifyAdminRole = ( req, res, next ) => {
    const user = req.user;

    if ( user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No permitido'
            }
        });
    }

    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole
};