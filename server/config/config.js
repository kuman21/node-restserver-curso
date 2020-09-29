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
process.env.EXPIRATION_TOKEN = '48h';

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

/**
 * Google Client ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '989804380216-3m1i0v0im216oeo14339un7catdus71r.apps.googleusercontent.com';
