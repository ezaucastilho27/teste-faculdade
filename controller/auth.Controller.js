
// /controllers/authController.js - Controlador de autenticação
const User = require('../models/User');
const Admin = require('../models/Admin');
const Perito = require('../models/Perito');
const Assistente = require('../models/Assistente');

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, senha, role, ...extraFields } = req.body;

    let user;
    
    // Criar o tipo correto de usuário com base no papel (role)
    if (role === 'admin') {
      user = await Admin.create({
        name,
        email,
        senha,
        role,
        ...extraFields
      });
    } else if (role === 'perito') {
      user = await Perito.create({
        name,
        email,
        senha,
        role,
        ...extraFields
      });
    } else {
      user = await Assistente.create({
        name,
        email,
        senha,
        role: role || 'assistente',
        ...extraFields
      });
    }

    // Gerar e enviar token
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validar email e senha
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça um email e senha'
      });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+senha');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Verificar se a senha corresponde
    const isMatch = await user.matchPassword(senha);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Chamar o método de login (do diagrama)
    await user.login();
    
    // Enviar token
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Logout do usuário
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Chamar o método de logout (do diagrama)
    if (req.user) {
      await req.user.logout();
    }
    
    // Limpar cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // 10 segundos
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Função auxiliar para enviar resposta com token
const sendTokenResponse = (user, statusCode, res) => {
  // Criar token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000), // 30 dias
    httpOnly: true
  };

  // Ativar secure cookie em produção
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      role: user.role,
      id: user._id
    });
};
