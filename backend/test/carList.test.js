const supertest = require('supertest')
const mongoose = require('mongoose')
const initDatabase = require('../data/init-database')
const Car = require('../models/Car')
const CarList = require('../models/CarList')
const { app, connectTestDB } = require('./app_test')

const request = supertest(app)

describe('CARSLIST TEST', () => {

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

  it('Debería devolver las listas de coches que están publicadas', async () => {
    const res = await request.get('/api/carList/public')

    chai.expect(res.status).to.equal(200)

    res.body.forEach(carList => {
      chai.expect(carList).to.have.property('posted').that.equals(true)
    })

  });

  it('Debería devolver las 10 listas de coches mejor valoradas', async () => {
    const res = await request.get('/api/carList/top-rated');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.has.lengthOf.at.most(10);

    chai.expect(res.body).to.be.an('array')

    let previousRating = Infinity;
    res.body.forEach(carList => {
      chai.expect(carList).to.have.property('ratings')
      chai.expect(carList.ratings).to.be.at.most(previousRating);
      previousRating = carList.ratings;
    });
  });

  it('Debería devolver como máximo 10 listas en la respuesta de las mejores listas valoradas', async () => {
    const res = await request.get('/api/carList/top-rated');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').with.lengthOf.at.most(10);
  });


  it('Debería devolver las 10 listas de coches con más comentarios', async () => {
    const res = await request.get('/api/carList/most-commented');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.has.lengthOf.at.most(10);

    // Verifica que las listas están ordenadas por comentarios en orden descendente
    let previousCommentCount = Infinity;
    res.body.forEach(carList => {
      chai.expect(carList).to.have.property('comments').that.is.an('array')
      chai.expect(carList.comments.length).to.be.at.most(previousCommentCount);
      previousCommentCount = carList.comments.length;
    });
  });


  it('Debería devolver como máximo 10 listas en la respuesta de las listas con más comentarios', async () => {
    const res = await request.get('/api/carList/most-commented');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').with.lengthOf.at.most(10);
  });

  it('Debería devolver las 10 últimas listas de coches publicadas', async () => {
    const res = await request.get('/api/carList/latest');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.has.lengthOf.at.most(10);

    let previousDate = new Date();
    res.body.forEach(carList => {
      chai.expect(carList).to.have.property('createdAt');
      const currentDate = new Date(carList.createdAt);
      chai.expect(currentDate).to.be.at.most(previousDate);
      previousDate = currentDate;
    });
  });

  it('Debería devolver como máximo 10 listas en la respuesta de las listas de coches publicadas', async () => {
    const res = await request.get('/api/carList/latest');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').with.lengthOf.at.most(10);
  });

  it('Debería devolver 10 listas de coches aleatorias', async () => {
    const res = await request.get('/api/carList/random');

    chai.expect(res.status).to.equal(200);

    // Verifica que la respuesta sea un array
    chai.expect(res.body).to.be.an('array').that.has.lengthOf.at.most(10);

    // Verifica que todas las listas tengan la propiedad 'posted' como 'true'
    res.body.forEach(carList => {
      chai.expect(carList).to.have.property('posted').that.equals(true);
    });
  });

  it('Debería devolver como máximo 10 listas en la respuesta de las listas de coches aleatorias', async () => {
    const res = await request.get('/api/carList/random');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').with.lengthOf.at.most(10);
  });

  it('No debería devolver una lista si el ID no es válido', async () => {
    const invalidId = '12345'; // ID inválido

    const res = await request.get(`/api/carList/${invalidId}`);

    chai.expect(res.status).to.equal(404);
  });


  it('Debería permitir crear una lista de coches', async () => {

    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    chai.expect(signin.body).to.have.property('token');
    chai.expect(signin.status).to.equal(200);
    token = signin.body.token;

    const cars = await Car.find()
    const carListData = {
      listName: 'Mi lista de coches favoritos',
      cars: [cars[0]._id, cars[1]._id, cars[2]._id],
    };

    const res = await request
      .post('/api/carList')
      .set('Authorization', `Bearer ${token}`)
      .send(carListData);

    // Comprobamos que la respuesta es correcta
    chai.expect(res.status).to.equal(201);
    chai.expect(res.body).to.have.property('listName').that.equals('Mi lista de coches favoritos');
    chai.expect(res.body).to.have.property('cars').that.is.an('array').with.lengthOf(3);


    // Verificamos que el ID de la lista está en el usuario
    const userRes = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(userRes.status).to.equal(200);
    const userCarsList = userRes.body.user.carsList;

    // Verificamos que la nueva lista se haya agregado correctamente al usuario
    const newCarList = userCarsList.find(list => list._id === res.body._id);
    chai.expect(newCarList).to.exist;
    chai.expect(newCarList).to.have.property('listName').that.equals('Mi lista de coches favoritos');
    chai.expect(newCarList).to.have.property('ratings').that.equals(0);
    chai.expect(newCarList).to.have.property('posted').that.equals(false);
    chai.expect(newCarList).to.have.property('comments').that.is.an('array').with.lengthOf(0);

  });

  it('No debería permitir crear una lista de coches sin token', async () => {

    const cars = await Car.find()
    const carListData = {
      listName: 'Mi lista de coches favoritos',
      cars: [cars[0]._id, cars[1]._id, cars[2]._id],
    };

    const res = await request
      .post('/api/carList')
      .send(carListData);

    chai.expect(res.status).to.equal(401);
    chai.expect(res.body).to.have.property('message').that.equals('Sin token, acceso denegado');
  });


  it('No debería permitir crear una lista de coches sin el nombre de la lista', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    const token = signin.body.token;

    const car = {
      brand: 'aa',
      model: 'aa',
      country: 'aaa',
      fuelType: 'aa',
      category: 'aaa',
      startingPrice: 1000,
      maximumSpeed: 112,
      linkImage: 'asda',
      description: 'Una vez',
      manufactureYear: 1234,
      tractionType: '123123',
      motorType: 'Pop'
    }

    const carListData = {
      cars: [car],
    };

    const res = await request
      .post('/api/carList')
      .set('Authorization', `Bearer ${token}`)
      .send(carListData);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('CarList validation failed');
    chai.expect(res.body.error).to.include('cars.0: Cast to [ObjectId] failed');
    chai.expect(res.body.error).to.include('Path `listName` is required');
  });


  it('Debería devolver un error si el usuario no tiene un token válido', async () => {
    // Simula un token de un usuario que no existe
    const fakeToken = 'fake_token_example';

    const cars = await Car.find()

    const carListData = {
      listName: 'Lista de coches de un usuario inexistente',
      cars: [cars[1]._id, cars[0]._id],
    };

    const res = await request
      .post('/api/carList')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(carListData);

    // Comprobamos que la respuesta es un error
    chai.expect(res.status).to.equal(400)
    chai.expect(res.body.message).to.equal('Token no válido');
  });


  it('Debería permitir eliminar la lista de coches si el usuario es el propietario', async () => {

    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    chai.expect(signin.body).to.have.property('token');
    chai.expect(signin.status).to.equal(200);
    token = signin.body.token;


    const resGetUserInfo = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)


    const carListId = resGetUserInfo.body.user.carsList[0]._id

    const res = await request
      .delete(`/api/carList/${carListId}`)
      .set('Authorization', `Bearer ${token}`);

    // Comprobamos que la respuesta sea exitosa
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('message').that.equals('Lista de coches eliminada correctamente');

    // Verificamos que la lista ya no esté en las listas del usuario
    const userRes = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(userRes.status).to.equal(200);
    const userCarsList = userRes.body.user.carsList;
    chai.expect(userCarsList).to.not.deep.include({ _id: carListId });

  });


  it('No debería permitir eliminar una lista que no pertenece al usuario', async () => {

    const credentials = {
      email: 'maria.lopez@gmail.com',
      password: 'mariapass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    chai.expect(signin.body).to.have.property('token');
    const fakeToken = signin.body.token;

    const credentials2 = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin2 = await request
      .post('/api/users/signin')
      .send(credentials2);

    chai.expect(signin2.body).to.have.property('token');
    chai.expect(signin2.status).to.equal(200);
    token = signin2.body.token;


    const resGetUserInfo = await request
      .get('/api/users/me')  // Ruta que queremos probar
      .set('Authorization', `Bearer ${token}`)


    const carListId = resGetUserInfo.body.user.carsList[0]._id

    // Intentar eliminar la lista creada por otro usuario
    const res = await request
      .delete(`/api/carList/${carListId}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    // Comprobamos que la respuesta es un error 403 (sin permisos)
    chai.expect(res.status).to.equal(403);
    chai.expect(res.body).to.have.property('message').that.equals('No tienes permiso para eliminar esta lista');
  });


  it('No debería permitir eliminar una lista si no existe', async () => {

    const credentials = {
      email: 'maria.lopez@gmail.com',
      password: 'mariapass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    token = signin.body.token;

    // Usar un ID de lista que no existe
    const fakeCarListId = new mongoose.Types.ObjectId();

    const res = await request
      .delete(`/api/carList/${fakeCarListId}`)
      .set('Authorization', `Bearer ${token}`);

    // Comprobamos que la respuesta es un error 404
    chai.expect(res.status).to.equal(404);
    chai.expect(res.body).to.have.property('message').that.equals('Lista de coches no encontrada');
  });


  it('No debería permitir eliminar una lista de coches que ya ha sido eliminada', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    const token = signin.body.token;

    const resGetUserInfo = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    const carListId = resGetUserInfo.body.user.carsList[0]._id;

    // Eliminar la lista
    await request
      .delete(`/api/carList/${carListId}`)
      .set('Authorization', `Bearer ${token}`);

    // Intentar eliminarla de nuevo
    const resDeleteAgain = await request
      .delete(`/api/carList/${carListId}`)
      .set('Authorization', `Bearer ${token}`);

    chai.expect(resDeleteAgain.status).to.equal(404);
    chai.expect(resDeleteAgain.body.message).to.equal('Lista de coches no encontrada');
  });


  it('Debería permitir modificar la lista', async () => {
    const cars = await Car.find()

    const credentials = {
      email: 'maria.lopez@gmail.com',
      password: 'mariapass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    token = signin.body.token;

    let resGetUserInfo = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)

    const carListId = resGetUserInfo.body.user.carsList[0]._id

    const updatedCarListData = {
      listName: 'Lista de coches modificada',
      cars: [cars[0]._id, cars[1]._id],
      posted: true,
    };

    const res = await request
      .patch(`/api/carList/${carListId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedCarListData);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body.message).to.equal('Lista de coches modificado')

    resGetUserInfo = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)

    const carListModified = resGetUserInfo.body.user.carsList[0]
    chai.expect(carListModified).to.have.property('listName').that.equals(updatedCarListData.listName);
    chai.expect(carListModified).to.have.property('posted').that.equals(updatedCarListData.posted);
    chai.expect(carListModified.cars.toString()).deep.equal(updatedCarListData.cars.toString());

  });

  it('No debería permitir modificar una lista inexistente', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    token = signin.body.token;

    const fakeCarListId = new mongoose.Types.ObjectId();

    const updatedCarListData = {
      listName: 'Lista inexistente modificada',
      posted: true,
    };

    const res = await request
      .patch(`/api/carList/${fakeCarListId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedCarListData);

    chai.expect(res.status).to.equal(404);
    chai.expect(res.body.message).to.equal('Lista de coches no encontrada');
  });


  it('No debería permitir a un usuario editar una lista que no le pertenece', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    const token = signin.body.token;

    const credentials2 = {
      email: 'maria.lopez@gmail.com',
      password: 'mariapass',
    };

    const signin2 = await request
      .post('/api/users/signin')
      .send(credentials2);

    const token2 = signin2.body.token;

    const carList = await CarList.findOne();  // Obtener una lista creada por el primer usuario

    const updatedCarListData = { listName: 'Nueva lista modificada' };

    const res = await request
      .patch(`/api/carList/${carList._id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send(updatedCarListData);

    chai.expect(res.status).to.equal(403);
    chai.expect(res.body.message).to.equal('No tienes permiso para modificar esta lista');
  });


  it('Debería permitir añadir un comentario a una lista de coches', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass',
    };

    const signin = await request
      .post('/api/users/signin')
      .send(credentials);

    token = signin.body.token;

    const carList = await CarList.findOne(); // Obtener una lista existente
    const id = carList._id

    const commentData = { comment: '¡Gran lista de coches!' };

    const res = await request
      .post(`/api/carList/${id}/comment`)
      .set('Authorization', `Bearer ${token}`)
      .send(commentData);

    chai.expect(res.status).to.equal(201);
    chai.expect(res.body.message).to.equal('Comentario añadido correctamente');
  });


  it('No debería permitir añadir un comentario sin token', async () => {
    const carList = await Car.findOne(); // Obtener una lista existente

    const commentData = { comment: '¡Comentario sin token!' };

    const res = await request
      .post(`/api/carList/${carList._id}/comment`)
      .send(commentData);

    chai.expect(res.status).to.equal(401);
    chai.expect(res.body).to.have.property('message').that.equals('Sin token, acceso denegado');
  });


  it('No debería permitir eliminar una lista sin token', async () => {
    const carList = await Car.findOne();

    const res = await request
      .delete(`/api/carList/${carList._id}`);

    chai.expect(res.status).to.equal(401);
    chai.expect(res.body).to.have.property('message').that.equals('Sin token, acceso denegado');
  });


})