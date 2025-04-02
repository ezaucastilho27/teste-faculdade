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