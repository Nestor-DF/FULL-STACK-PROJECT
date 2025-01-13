require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const cors = require('cors');

// Inicializa la aplicación para pruebas
const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());

// Configuración de variables de entorno
const dotenv = require('dotenv');
dotenv.config();

const connectTestDB = require('../config/db_test');
connectTestDB();

// Rutas
const carRoutes = require('../routes/carRoutes');
app.use('/api', carRoutes);

const userRoutes = require('../routes/userRoutes');
app.use('/api', userRoutes);

const carListRoutes = require('../routes/carlistRoutes');
app.use('/api', carListRoutes);

const imageRoutes = require('../routes/imageRoutes');
app.use('/api', imageRoutes);

const newsRoutes = require('../routes/newsRoutes');
app.use('/api', newsRoutes);

module.exports = { app, connectTestDB }; // Exporta la app y la función para conectar a la base de datos
