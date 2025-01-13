const mongoose = require('mongoose');

const connectTestDB = async () => {
  try {
    // Conecta con la base de datos de pruebas usando la URI proporcionada
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    console.log('Conectado a la base de datos de pruebas');
  } catch (error) {
    console.error('Error conectando a la base de datos de pruebas:', error);
    process.exit(1); // Terminar el proceso si no se puede conectar
  }
};

module.exports = connectTestDB;
