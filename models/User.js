const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Schema do usuário (campos do banco de dados)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe um nome'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, informe um email válido']
  },
  senha: {
    type: String,
    required: [true, 'Por favor, informe uma senha'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'perito', 'assistente'],
    default: 'assistente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para verificar senha
UserSchema.methods.matchPassword = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Método para gerar token JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'sua_chave_secreta',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Métodos do diagrama
UserSchema.methods.login = async function() {
  return this.getSignedJwtToken();
};

UserSchema.methods.logout = function() {
  return true;
};

module.exports = mongoose.model('User', UserSchema);