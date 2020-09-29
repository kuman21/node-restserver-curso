const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: { type: String, unique: true, require: [true, 'La categoría es obligatoria'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Category', categorySchema);
