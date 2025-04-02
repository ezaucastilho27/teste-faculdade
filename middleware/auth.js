const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rotas - verificar se o usuário está autenticado
exports.protect = async (req, res, next) => {
  let token;

  // Verificar se o token está nos headers ou cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Obter token do header Bearer
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Obter token do cookie
    token = req.cookies.token;
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Não autorizado para acessar esta rota'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');

    // Adicionar usuário à requisição
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Não autorizado para acessar esta rota'
    });
  }
};

// Middleware para verificar permissões por papel (role)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Usuário com função ${req.user.role} não está autorizado a acessar esta rota`
      });
    }
    next();
  };
};

//========================================================================
// ROUTES (Definição de endpoints da API)
//========================================================================

// /routes/authRoutes.js - Rotas de autenticação
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rotas públicas (não precisam de autenticação)
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas (precisam de autenticação)
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;