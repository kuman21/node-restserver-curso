/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento del token
 */
process.env.EXPIRATION_TOKEN = '30 days';

/**
 * SEED de autenticación
 */
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

/**
 * Base de datos
 */
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;