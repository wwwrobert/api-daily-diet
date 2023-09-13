const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET; 

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação ausente.' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token de autenticação inválido.' });
    }
    req.user = user;

    res.status(200).json({ message: 'Autenticado com sucesso.' });

    next();
  });
}

module.exports = authenticateToken;
