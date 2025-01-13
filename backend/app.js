const express = require('express');
const app = express();

// Permitir frontend y backend se comuniquen sin problemas de CORS.
const cors = require('cors')
app.use(cors())

// Configuración de variables de entorno
const dotenv = require('dotenv');
dotenv.config();

// Conexión a la base de datos
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(express.json());

// Rutas
const carRoutes = require('./routes/carRoutes');
app.use('/api', carRoutes);

const userRoutes = require('./routes/userRoutes')
app.use('/api', userRoutes)

const carListRoutes = require('./routes/carlistRoutes')
app.use('/api', carListRoutes)

const imageRoutes = require('./routes/imageRoutes')
app.use('/api', imageRoutes)

const newsRoutes = require('./routes/newsRoutes');
app.use('/api', newsRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));