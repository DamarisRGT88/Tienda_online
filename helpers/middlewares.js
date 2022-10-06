const jwt = require('jsonwebtoken');
const User = require('../models/user.model')
const checkToken = async (req, res, next) => {
    // 1 - Si el token viene incluido en las cabeceras    
    if (!req.headers['authorization']) {
        return res.json({ error: 'No has incluido la cabecera' })
    }
    const { authorization: token } = req.headers;
    // 2 -Comprobar si el token funciona
    let obj;
    try {
        obj = jwt.verify(token, process.env.SECRET_KEY);

    } catch (err) {
        return res.json({ error: 'El token no es correcto' })
    }

    //!Recuperar el usuario que ha realizado el login
    const user = await User
        .findById(obj.userId)
        .populate('products');
    req.user = user;
    next()
}

module.exports = { checkToken }