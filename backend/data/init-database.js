const mongoose = require('mongoose')
const insertCars = require('./insertCars')
const insertImages = require('./insertImages')
const insertUsers = require('./insertUsers')
const insertCarLists = require('./insertCarLists')

const initDatabase = async (uri = process.env.MONGODB_URI) => {
  if (!uri) {
    throw new Error("No se ha proporcionado una URI de MongoDB y no hay valor predeterminado.");
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Conexión exitosa a MongoDB en la URI: ${uri}`);

    await insertCars();
    await insertImages();
    await insertUsers();
    await insertCarLists();

    console.log("Datos inicializados correctamente.");
  } catch (error) {
    console.error("Error durante la inicialización de la base de datos:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Desconexión de MongoDB realizada.");
  }
};

module.exports = initDatabase;
