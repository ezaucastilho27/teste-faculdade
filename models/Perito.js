const mongoose = require('mongoose');
const User = require('./User');

// Schema específico do Perito
const PeritoSchema = new mongoose.Schema({
  especialidade: {
    type: String,
    required: [true, 'Por favor, informe a especialidade do perito']
  },
  disponivel: {
    type: Boolean,
    default: true
  }
});

// Métodos do diagrama
PeritoSchema.methods.cadastrarCaso = async function() {
  return { message: 'Cadastrando caso' };
};

PeritoSchema.methods.analisarEvidencias = async function() {
  return { message: 'Analisando evidências' };
};

PeritoSchema.methods.gerarLaudo = async function() {
  return { message: 'Gerando laudo' };
};

// Criar modelo Perito estendendo User
const Perito = User.discriminator('Perito', PeritoSchema);
module.exports = Perito;