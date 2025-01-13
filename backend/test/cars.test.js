const supertest = require('supertest')
const mongoose = require('mongoose')
const initDatabase = require('../data/init-database')
const { app, connectTestDB } = require('./app_test')

const request = supertest(app)

describe('CARS TEST', () => {

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

    const adminCredentials = {
      email: 'nestor@gmail.com',
      password: '1234',
    };

    const signinRes = await request.post('/api/users/signin').send(adminCredentials);
    adminToken = signinRes.body.token;
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


  it('Debería devolver los metadatos de los coches', async () => {
    const res = await request.get('/api/cars/metadata');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('brands').that.is.an('array');
    chai.expect(res.body).to.have.property('countries').that.is.an('array');
    chai.expect(res.body).to.have.property('fuelTypes').that.is.an('array');
    chai.expect(res.body).to.have.property('tractionTypes').that.is.an('array');
    chai.expect(res.body).to.have.property('price').that.is.an('object');
    chai.expect(res.body.price).to.have.property('min');
    chai.expect(res.body.price).to.have.property('max');
    chai.expect(res.body).to.have.property('maximumSpeed');
    chai.expect(res.body).to.have.property('manufactureYear').that.is.an('object');
    chai.expect(res.body.manufactureYear).to.have.property('min');
    chai.expect(res.body.manufactureYear).to.have.property('max');
  });


  it('Debería devolver coches filtrados por marca', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ brands: ['Toyota'] });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car).to.have.property('brand').that.equals('Toyota')
    })
  });

  it('Debería devolver coches filtrados por precio', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ price: { min: 20000, max: 30000 } });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car.startingPrice).to.be.at.least(20000);
      chai.expect(car.startingPrice).to.be.at.most(30000);
    });
  });

  it('Debería devolver coches filtrados por velocidad máxima', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ speed: { min: 120, max: 180 } });
  
    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car.maximumSpeed).to.be.at.least(120);
      chai.expect(car.maximumSpeed).to.be.at.most(180);
    });
  });
  


  it('Debería devolver coches filtrados por año de fabricación', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ manufactureYear: { min: 2023, max: 2023 } });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car.manufactureYear).to.equal(2023);
    });
  });

  it('Debería devolver coches filtrados por tipo de combustible', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ fuelTypes: ['Gasolina'] });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car).to.have.property('fuelType').that.equals('Gasolina');
    });
  });

  it('Debería devolver coches filtrados por tracción', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ tractionTypes: ['Tracción total'] });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car).to.have.property('tractionType').that.equals('Tracción total');
    });
  });

  it('Debería devolver coches filtrados por texto clave', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ string_clave: 'Aventador' });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      const matches = car.brand.includes('Aventador') ||
        car.model.includes('Aventador') ||
        car.description.includes('Aventador');
      chai.expect(matches).to.be.true;
    });
  });

  it('Debería devolver coches combinando filtros de marca y año', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ brands: ['Lamborghini'], manufactureYear: { min: 2021, max: 2021 } });

    chai.expect(res.status).to.equal(200);
    res.body.cars.forEach(car => {
      chai.expect(car).to.have.property('brand').that.equals('Lamborghini');
      chai.expect(car).to.have.property('manufactureYear').that.equals(2021);
    });
  });

  it('Debería devolver todos los coches si no se aplica ningún filtro', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({});

    chai.expect(res.status).to.equal(200);
  });

  it('Debería manejar correctamente cuando no hay coches que coincidan con los filtros', async () => {
    const res = await request.post('/api/cars/filter?page=1&pageSize=999')
      .send({ brands: ['NonexistentBrand'], manufactureYear: { min: 1990, max: 1990 } });

    chai.expect(res.status).to.equal(200);
  });


  it('No debería devolver un coche por ID', async () => {

    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.get(`/api/cars/${fakeId}`)

    chai.expect(res.status).to.equal(404)
    chai.expect(res.body.message).to.equal('Coche no encontrado')

  })

  it('Debería devolver un error 500 si el ID no es válido', async () => {
    const invalidId = '1234'; // ID no válido
    const res = await request.get(`/api/cars/${invalidId}`);

    chai.expect(res.status).to.equal(500);
    chai.expect(res.body).to.have.property('error');
  });

  it('Debería devolver 5 coches random por defecto', async () => {
    const res = await request.get('/api/cars/random');

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.has.lengthOf.at.most(5);
    res.body.forEach(car => {
      chai.expect(car).to.have.property('_id');
      chai.expect(car).to.have.property('brand');
      chai.expect(car).to.have.property('model');
    });
  });


  it('Debería devolver el número de coches random especificado en el parámetro "limit"', async () => {
    const limit = 2;
    const res = await request.get('/api/cars/random')
      .query({ limit });

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.has.lengthOf(limit);
    res.body.forEach(car => {
      chai.expect(car).to.have.property('_id');
      chai.expect(car).to.have.property('brand');
      chai.expect(car).to.have.property('model');
    });
  });


  // Test de rutas protegidas

  it('Debería crear un nuevo coche con autenticación y rol de administrador', async () => {
    const newCar = {
      brand: 'Toyota',
      model: 'Corolla',
      country: 'Japón',
      fuelType: 'Gasolina',
      category: 'Sedán',
      startingPrice: 20000,
      maximumSpeed: 180,
      linkImage: 'https://example.com/image.jpg',
      description: 'Un coche confiable y económico.',
      acceleration: 10,
      manufactureYear: 2022,
      tractionType: 'Tracción delantera',
      motorType: 'Híbrido',
    };

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCar);

    chai.expect(res.status).to.equal(201);
    chai.expect(res.body).to.include(newCar);
  });



  it('No debería permitir un coche sin la marca (brand)', async () => {
    const car = {
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

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `brand` is required');
  });


  it('No debería permitir un coche sin el modelo (model)', async () => {
    const car = {
      brand: 'asd',
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

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `model` is required');
  });

  it('No debería permitir un coche sin el país (country)', async () => {
    const car = {
      brand: 'asd',
      model: 'asdasd',
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

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `country` is required');
  });

  it('No debería permitir un coche sin el tipo de combustible (fuelType)', async () => {
    const car = {
      brand: 'asd',
      model: 'asdasd',
      country: 'E',
      category: 'aaa',
      startingPrice: 1000,
      maximumSpeed: 112,
      linkImage: 'asda',
      description: 'Una vez',
      manufactureYear: 1234,
      tractionType: '123123',
      motorType: 'Pop'
    }

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `fuelType` is required');
  });

  it('No debería permitir un coche sin la categoría (category)', async () => {
    const car = {
      brand: 'asd',
      model: 'asdasd',
      country: 'E',
      fuelType: 'asdasd',
      startingPrice: 1000,
      maximumSpeed: 112,
      linkImage: 'asda',
      description: 'Una vez',
      manufactureYear: 1234,
      tractionType: '123123',
      motorType: 'Pop'
    }

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `category` is required');
  });


  it('No debería permitir un coche sin el precio inicial (startingPrice)', async () => {
    const car = {
      brand: 'asd',
      model: 'asdasd',
      country: 'E',
      fuelType: 'asdasd',
      category: 'aaa',
      maximumSpeed: 112,
      linkImage: 'asda',
      description: 'Una vez',
      manufactureYear: 1234,
      tractionType: '123123',
      motorType: 'Pop'
    }

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `startingPrice` is required');
  });

  it('No debería permitir un coche sin el año de fabricación (manufactureYear)', async () => {
    const car = {
      brand: 'asd',
      model: 'asdasd',
      country: 'E',
      fuelType: 'asdasd',
      category: 'aaa',
      startingPrice: 1000,
      maximumSpeed: 112,
      linkImage: 'asda',
      description: 'Una vez',
      tractionType: '123123',
      motorType: 'Pop'
    }

    const res = await request
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(car);

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body.error).to.include('Path `manufactureYear` is required');
  });

  it('Debería actualizar un coche por ID con autenticación y rol de administrador', async () => {
    const limit = 1;
    const randomCarsRes = await request.get('/api/cars/random').query({ limit });

    chai.expect(randomCarsRes.status).to.equal(200);
    chai.expect(randomCarsRes.body).to.be.an('array').that.has.lengthOf(limit);

    const carId = randomCarsRes.body[0]._id;
    const updatedCarData = {
      model: 'Accord',
      startingPrice: 27000,
      maximumSpeed: 220,
    };

    const res = await request
      .put(`/api/cars/${carId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedCarData);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('model', 'Accord');
    chai.expect(res.body).to.have.property('startingPrice', 27000);
    chai.expect(res.body).to.have.property('maximumSpeed', 220);
  });

  it('Debería eliminar un coche por ID con autenticación y rol de administrador', async () => {
    const limit = 1;
    const randomCarsRes = await request.get('/api/cars/random').query({ limit });

    chai.expect(randomCarsRes.status).to.equal(200);
    chai.expect(randomCarsRes.body).to.be.an('array').that.has.lengthOf(limit);

    const carId = randomCarsRes.body[0]._id;

    const res = await request
      .delete(`/api/cars/${carId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('message', 'Coche y referencias eliminadas correctamente');
  });

  it('Debería eliminar un coche por ID con autenticación y rol de administrador', async () => {
    const limit = 1;
    const randomCarsRes = await request.get('/api/cars/random').query({ limit });

    chai.expect(randomCarsRes.status).to.equal(200);
    chai.expect(randomCarsRes.body).to.be.an('array').that.has.lengthOf(limit);

    const carId = randomCarsRes.body[0]._id;

    const res = await request
      .delete(`/api/cars/${carId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('message', 'Coche y referencias eliminadas correctamente');
  });

  it('No Debería eliminar un coche por ID si este es erróneo', async () => {
    const limit = 1;
    const randomCarsRes = await request.get('/api/cars/random').query({ limit });

    chai.expect(randomCarsRes.status).to.equal(200);
    chai.expect(randomCarsRes.body).to.be.an('array').that.has.lengthOf(limit);

    const carId = '1234'; // ID no válido

    const res = await request
      .delete(`/api/cars/${carId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(500);
  });

})