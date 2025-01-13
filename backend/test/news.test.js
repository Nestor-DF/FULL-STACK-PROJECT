const supertest = require('supertest')
const mongoose = require('mongoose')
const initDatabase = require('../data/init-database')
const { app, connectTestDB } = require('./app_test')

const request = supertest(app)

describe('NEWS TEST', () => {
  let chai

  before(async () => {
    await initDatabase(process.env.MONGODB_URI_TEST)

    const maxRetries = 5;
    let retries = 0;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    while (retries < maxRetries) {
      try {
        await connectTestDB()
        console.log("Conectado a la base de datos de pruebas");
        break; // Si la conexión es exitosa, salimos del bucle
      } catch (err) {
        console.error(`Error conectando a la base de datos: ${err.message}`);
        retries++;
        if (retries >= maxRetries) {
          throw new Error("No se pudo conectar a la base de datos después de varios intentos");
        }
        await delay(2000); // Espera 2 segundos antes de reintentar
      }
    }
    chai = await import('chai')
  });

  after(async () => {
    console.log("Limpiando la base de datos de pruebas...");

    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });


    if (mongoose.connection.name === 'CarsHubTest') {
      console.log("Limpiando la base de datos de pruebas...");
      await mongoose.connection.dropDatabase();
    }

    await mongoose.connection.close();
    console.log("Conexión cerrada.");
  });


  it('Debería obtener las últimas noticias relacionadas con "cars"', async () => {
    const res = await request.get('/api/news/latest').query({ page: 1, pageSize: 5 });
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('articles').that.is.an('array').that.is.not.empty;
    chai.expect(res.body).to.have.property('totalResults').that.is.a('number');
    chai.expect(res.body).to.have.property('currentPage', 1);
    chai.expect(res.body).to.have.property('totalPages').that.is.a('number');
  });

  it('Debería obtener las últimas noticias relacionadas con "cars"', async () => {
    const res = await request.get('/api/news/latest').query({ page: 3, pageSize: 10 });
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('articles').that.is.an('array').that.is.not.empty;
    chai.expect(res.body).to.have.property('totalResults').that.is.a('number');
    chai.expect(res.body).to.have.property('currentPage', 3);
    chai.expect(res.body).to.have.property('totalPages').that.is.a('number');
  });

  it('Debería obtener las noticias correctamente con un tamaño de página personalizado', async () => {
    const res = await request.get('/api/news/latest').query({ page: 1, pageSize: 3 });
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('articles').that.is.an('array').that.has.lengthOf.at.most(3);
    chai.expect(res.body).to.have.property('totalResults').that.is.a('number');
    chai.expect(res.body).to.have.property('currentPage', 1);
    chai.expect(res.body).to.have.property('totalPages').that.is.a('number');
  });

  it('Debería obtener las noticias correctamente con un tamaño de página personalizado', async () => {
    const res = await request.get('/api/news/latest').query({ page: 4, pageSize: 11 });
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('articles').that.is.an('array').that.has.lengthOf.at.most(11);
    chai.expect(res.body).to.have.property('totalResults').that.is.a('number');
    chai.expect(res.body).to.have.property('currentPage', 4);
    chai.expect(res.body).to.have.property('totalPages').that.is.a('number');
  });

  it('Debería de fallar con parámetros incorrectos', async () => {
    const res = await request.get('/api/news/latest').query({ page: -4, pageSize: 11 });
    chai.expect(res.status).to.equal(500);
  });

  it('Debería de fallar con parámetros incorrectos', async () => {
    const res = await request.get('/api/news/latest').query({ page: 4, pageSize: -11 });
    chai.expect(res.status).to.equal(500);
  });

  it('Debería de funcionar sin parámetros, pilla unos por defecto', async () => {
    const res = await request.get('/api/news/latest');
    chai.expect(res.status).to.equal(200);
  });

})