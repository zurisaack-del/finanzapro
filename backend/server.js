require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');

connectDB();

const app = express();

// Configuración de CORS para desarrollo local y producción en Vercel
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Agrega aquí tu dominio final de Vercel al desplegar
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);

// Ruta de verificación de estado (Health Check para Render)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API FinanzaPro operativa' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});