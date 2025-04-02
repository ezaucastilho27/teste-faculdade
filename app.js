const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Importar rotas
const authRoutes = require('./routes/authRoutes');

// Inicializar app
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear cookies
app.use(cookieParser());

// Montar rotas
app.use('/api/auth', authRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.send('API do Sistema de Autenticação está rodando');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});