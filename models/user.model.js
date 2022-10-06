const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'El campo username es obligatorio'],
        minLength: [3, 'El username debe tener como mínimo 3 caracteres'],
        maxLength: [10, 'El username debe tener como máximo 10 caracteres']
    },
    email: {
        type: String,
        match: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: String,
    active: Boolean,
    role: {
        type: String,
        default: 'regular',
        enum: {
            values: ['regular', 'admin'],
            message: 'Valor invalido para el role'
        }
    },
    products: [{
        type: Schema.Types.ObjectId, ref: 'product'
    }]
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);