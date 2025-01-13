const supertest = require('supertest')
const mongoose = require('mongoose')
const initDatabase = require('../data/init-database')
const { app, connectTestDB } = require('./app_test')

const request = supertest(app)

describe('IMAGES TEST', () => {
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


  it('Debería devolver la imagen del avatar del usuario', async () => {

    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass'
    };

    const res1 = await request
      .post(`/api/users/signin`)
      .send(credentials)

    chai.expect(res1.body).to.have.property('token');
    chai.expect(res1.status).to.equal(200)

    token = res1.body.token;

    const res2 = await request
      .get('/api/users/me')  // Ruta que queremos probar
      .set('Authorization', `Bearer ${token}`)

    chai.expect(res2.status).to.equal(200)

    const res3 = await request.get(`/api/avatar/${res2.body.user.avatar._id}`)

    chai.expect(res3.status).to.equal(200)
    chai.expect(res3.body).to.have.property('linkImage')
    chai.expect(res3.body).to.have.property('name')

  })

  it('No debería devolver la imagen del avatar del usuario', async () => {

    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.get(`/api/avatar/${fakeId}`)

    chai.expect(res.status).to.equal(404)
    chai.expect(res.body.message).to.equal('Imagen no encontrada')

  })

  it('Debería devolver la imagen del avatar del usuario', async () => {

    const credentials = {
      email: 'nestor@gmail.com',
      password: '1234',
    };

    const res1 = await request
      .post(`/api/users/signin`)
      .send(credentials)

    chai.expect(res1.body).to.have.property('token');
    chai.expect(res1.status).to.equal(200)

    token = res1.body.token;

    const res2 = await request
      .get('/api/users/me')  // Ruta que queremos probar
      .set('Authorization', `Bearer ${token}`)

    chai.expect(res2.status).to.equal(200)

    const res3 = await request.get(`/api/avatar/${res2.body.user.avatar._id}`)

    chai.expect(res3.status).to.equal(200)
    chai.expect(res3.body).to.have.property('linkImage')
    chai.expect(res3.body).to.have.property('name')

  })

  it('No debería devolver la imagen del avatar del usuario', async () => {

    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.get(`/api/avatar/${fakeId}`)

    chai.expect(res.status).to.equal(404)
    chai.expect(res.body.message).to.equal('Imagen no encontrada')

  })

})