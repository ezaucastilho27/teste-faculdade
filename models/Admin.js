const mongoose = require('mongoose');
const User = require('./User');

// Schema específico do Admin
const AdminSchema = new mongoose.Schema({
  // Campos específicos do Admin, se necessário
  departamento: {
    type: String,
    default: 'Administração'
  }
});

// Métodos do diagrama
AdminSchema.methods.gerenciarUsuarios = async function() {
  return { message: 'Gerenciando usuários' };
};

AdminSchema.methods.configurarSistema = async function() {
  return { message: 'Configurando sistema' };
};

// Criar modelo Admin estendendo User
const Admin = User.discriminator('Admin', AdminSchema);
module.exports = Admin;