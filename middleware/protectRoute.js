const jwt = require('jsonwebtoken');

exports.protectRoute = (req, res, next)=> {
    const authHeader = req.headers['authorization'];

    console.log("protec route run kr toh rha h ");
    console.log(authHeader);

    if (!authHeader)
        return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
