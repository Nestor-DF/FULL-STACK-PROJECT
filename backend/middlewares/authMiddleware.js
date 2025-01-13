const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  // Extraer el token del encabezado Authorization
  const token = req.header('Authorization')?.split(' ')[1];  // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Sin token, acceso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Guarda la información (el id y el rol) del usuario en req.user
    next();  // Continúa con el siguiente middleware o controlador
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
    }
    next();
  };
};
