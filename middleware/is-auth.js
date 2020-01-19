const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    // Authorization:  Bearer doahdioaoihiov
    const token = authHeader.split(' ')[1];
    let decodedToken = undefined;
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    try {
        decodedToken = jwt.verify(token, 'unestringlonguepourhasher');
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}