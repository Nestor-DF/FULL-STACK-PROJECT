const supertest = require('supertest')
const mongoose = require('mongoose')
const initDatabase = require('../data/init-database')
const { app, connectTestDB } = require('./app_test')
const User = require('../models/User')

const request = supertest(app)

describe('USERS TEST', () => {
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

  it('Debería registrar un usuario y obtener un token', async () => {
    const newUser = {
      username: "registro",
      password: "registro",
      email: "registro@gmail.com"
    }

    const res = await request.post('/api/users/signup').send(newUser)

    chai.expect(res.status).to.equal(201)
    chai.expect(res.body).to.have.property('token')

  });

  it('No debería registrar un usuario, ya existe', async () => {
    const newUser = {
      username: "registro",
      password: "registro",
      email: "registro@gmail.com"
    }

    const res = await request.post('/api/users/signup').send(newUser)

    chai.expect(res.status).to.equal(400)
    chai.expect(res.body.message).to.equal('Usuario ya registrado')

  });

  it("Debería poder iniciar sesión el usuario con el token devuelto", async () => {

    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    const post = await request
      .post(`/api/users/signin`)
      .send(credentials)

    chai.expect(post.body).to.have.property('token');
    chai.expect(post.status).to.equal(200)
  })

  it("No debería poder iniciar sesión, email incorrecto", async () => {

    const credentials = {
      email: "maria.opez@gmail.com",
      password: "mariapass"
    };

    const post = await request
      .post(`/api/users/signin`)
      .send(credentials)

    chai.expect(post.status).to.equal(400)
    chai.expect(post.body.message).to.equal('Email incorrecto')
  })

  it("No debería poder iniciar sesión, contraseña incorrecta", async () => {

    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariaass"
    };

    const post = await request
      .post(`/api/users/signin`)
      .send(credentials)

    chai.expect(post.status).to.equal(400)
    chai.expect(post.body.message).to.equal('Contraseña incorrecta')
  })


  it('Debería poder obtener informacion del usuario mismo', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass'
    };

    const signin = await request
      .post(`/api/users/signin`)
      .send(credentials)

    chai.expect(signin.body).to.have.property('token');
    chai.expect(signin.status).to.equal(200)

    token = signin.body.token;

    const resGetUserInfo = await request
      .get('/api/users/me')  // Ruta que queremos probar
      .set('Authorization', `Bearer ${token}`)

    chai.expect(resGetUserInfo.status).to.equal(200);
    chai.expect(resGetUserInfo.body.user).to.have.property('username', 'juanito_77')
    chai.expect(resGetUserInfo.body.user).to.have.property('email', credentials.email);
    chai.expect(resGetUserInfo.body.user).to.have.property('name', 'Juan Perez');
    chai.expect(resGetUserInfo.body.user).to.have.property('avatar');
    chai.expect(resGetUserInfo.body.user).to.have.property('avatar');
    chai.expect(resGetUserInfo.body.user).to.have.property('carsList');
    chai.expect(resGetUserInfo.body.user).to.have.property('likedLists');
    chai.expect(resGetUserInfo.body.user).to.not.have.property('password'); // Asegurarnos de que la contraseña no está incluida
  });

  it('Debería poder dar me gusta a una lista', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    const signin = await request
      .post(`/api/users/signin`)
      .send(credentials)


    chai.expect(signin.body).to.have.property('token');
    chai.expect(signin.status).to.equal(200)

    const token = signin.body.token;
    let carList = await request.get('/api/carList/public')
    const carListRatingPrev = carList.body[0].ratings

    chai.expect(carList.status).to.equal(200)

    const likeListResponse = await request
      .patch('/api/users/likelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[0]._id });


    carList = await request.get('/api/carList/public')

    chai.expect(carList.body[0].ratings).to.equal(carListRatingPrev + 1)
    chai.expect(likeListResponse.status).to.equal(200);
    chai.expect(likeListResponse.body.message).to.equal('"Me gusta" agregado correctamente')

  });

  it('Debería devolver un error 404 si el usuario o la lista no existen', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Hacemos login para obtener el token
    const signinResponse = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signinResponse.body).to.have.property('token');
    chai.expect(signinResponse.status).to.equal(200);

    const token = signinResponse.body.token;

    const fakeId = new mongoose.Types.ObjectId();

    // Usamos un ID de lista que no existe
    const likeListResponse = await request
      .patch('/api/users/likelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: fakeId });

    chai.expect(likeListResponse.status).to.equal(404);
    chai.expect(likeListResponse.body.message).to.equal('Usuario o lista no encontrados');
  });

  it('Debería devolver un error 400 si el usuario ya dio "me gusta" a la lista', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Hacemos login para obtener el token
    const signinResponse = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signinResponse.body).to.have.property('token');
    chai.expect(signinResponse.status).to.equal(200);

    const token = signinResponse.body.token;

    const carList = await request.get('/api/carList/public')


    // Damos me gusta una vez
    await request
      .patch('/api/users/likelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[1]._id });


    // Ahora, intentamos dar "me gusta" de nuevo a la misma lista
    const likeListResponse = await request
      .patch('/api/users/likelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[1]._id });

    chai.expect(likeListResponse.status).to.equal(400);
    chai.expect(likeListResponse.body.message).to.equal('Ya diste "me gusta" a esta lista');
  });


  it('Debería poder eliminar el "me gusta" de una lista', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Hacemos login para obtener el token
    const signinResponse = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signinResponse.body).to.have.property('token');
    chai.expect(signinResponse.status).to.equal(200);

    const token = signinResponse.body.token;

    let carList = await request.get('/api/carList/public')
    const carListRatingPrev = carList.body[0].ratings

    // Ahora, intentamos eliminar el "me gusta"
    const dislikeListResponse = await request
      .patch('/api/users/dislikelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[0]._id });

    carList = await request.get('/api/carList/public')

    chai.expect(carList.body[0].ratings).to.equal(carListRatingPrev - 1)
    chai.expect(dislikeListResponse.status).to.equal(200);
    chai.expect(dislikeListResponse.body.message).to.equal('"Me gusta" eliminado correctamente');
  });

  it('Debería devolver un error 404 si el usuario o la lista no existen', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Hacemos login para obtener el token
    const signinResponse = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signinResponse.body).to.have.property('token');
    chai.expect(signinResponse.status).to.equal(200);

    const token = signinResponse.body.token;

    const fakeId = new mongoose.Types.ObjectId();

    // Usamos un ID de lista que no existe
    const dislikeListResponse = await request
      .patch('/api/users/dislikelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: fakeId });

    chai.expect(dislikeListResponse.status).to.equal(404);
    chai.expect(dislikeListResponse.body.message).to.equal('Usuario o lista no encontrados');
  });

  it('Debería devolver un error 400 si el usuario no ha dado "me gusta" a la lista', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Hacemos login para obtener el token
    const signinResponse = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signinResponse.body).to.have.property('token');
    chai.expect(signinResponse.status).to.equal(200);

    const token = signinResponse.body.token;

    const carList = await request.get('/api/carList/public')

    // Intentamos eliminar el "me gusta" de una lista a la que no hemos dado "me gusta"
    const dislikeListResponse = await request
      .patch('/api/users/dislikelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[2]._id });

    chai.expect(dislikeListResponse.status).to.equal(400);
    chai.expect(dislikeListResponse.body.message).to.equal('No has dado "me gusta" a esta lista');
  });

  it('Deberia devolver el usuario por id', async () => {
    const credentials = {
      email: 'juan.perez@gmail.com',
      password: 'juanpass'
    };

    // Hacemos login para obtener el token
    const signinResponse = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signinResponse.body).to.have.property('token');
    chai.expect(signinResponse.status).to.equal(200);

    token = signinResponse.body.token;

    const resGetUserInfo = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)

    chai.expect(resGetUserInfo.status).to.equal(200);

    const getUserId = await request.get(`/api/users/${resGetUserInfo.body.user._id}`)

    chai.expect(getUserId.status).to.equal(200)

    chai.expect(resGetUserInfo.body.user).to.have.property('username', 'juanito_77')
    chai.expect(resGetUserInfo.body.user).to.have.property('email', credentials.email);
    chai.expect(resGetUserInfo.body.user).to.have.property('name', 'Juan Perez');
    chai.expect(resGetUserInfo.body.user).to.have.property('avatar');
    chai.expect(resGetUserInfo.body.user).to.have.property('avatar');
    chai.expect(resGetUserInfo.body.user).to.have.property('carsList');
    chai.expect(resGetUserInfo.body.user).to.have.property('likedLists');
    chai.expect(resGetUserInfo.body.user).to.not.have.property('password'); // Asegurarnos de que la contraseña no está incluida
  })

  it('Deberia devolver true, el usuario le ha dado me gusta', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    const signin = await request
      .post(`/api/users/signin`)
      .send(credentials)


    chai.expect(signin.body).to.have.property('token');
    chai.expect(signin.status).to.equal(200)

    const token = signin.body.token;
    let carList = await request.get('/api/carList/public')

    const likeListResponse = await request
      .patch('/api/users/likelist')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[0]._id });

    chai.expect(likeListResponse.status).to.equal(200)

    carList = await request.get('/api/carList/public')

    const isListLiked = await request
      .post('/api/users/islistliked')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId: carList.body[0]._id })

    chai.expect(isListLiked.status).to.equal(200)
    chai.expect(isListLiked.body.isLiked).to.equal(true)

  })

  it('Debería devolver false, el usuario no le ha dado me gusta', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Inicia sesión y obtén el token
    const signin = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signin.body).to.have.property('token')
    chai.expect(signin.status).to.equal(200);

    const token = signin.body.token;

    const carList = await request.get('/api/carList/public')

    const listId = carList.body[3]._id

    const isListLiked = await request
      .post('/api/users/islistliked')
      .set('Authorization', `Bearer ${token}`)
      .send({ listId });

    chai.expect(isListLiked.status).to.equal(200);
    chai.expect(isListLiked.body.isLiked).to.equal(false);
  });

  it('Debería devolver 404, no se encuentra la lista para comprobar si le ha dado me gusta', async () => {
    const credentials = {
      email: "maria.lopez@gmail.com",
      password: "mariapass"
    };

    // Inicia sesión y obtén el token
    const signin = await request
      .post(`/api/users/signin`)
      .send(credentials);

    chai.expect(signin.body).to.have.property('token')
    chai.expect(signin.status).to.equal(200);

    const token = signin.body.token;

    const fakeId = new mongoose.Types.ObjectId();

    const isListLiked = await request
      .post('/api/users/islistliked')
      .set('Authorization', `Bearer ${token}`)
      .send({ fakeId });

    chai.expect(isListLiked.status).to.equal(404);
    chai.expect(isListLiked.body.message).to.equal('Usuario o lista no encontrados');
  });

  it('No deberia devolver el usuario por id, usuario no encontrado', async () => {

    const fakeId = new mongoose.Types.ObjectId();
    const getUserId = await request.get(`/api/users/${fakeId}`)
    chai.expect(getUserId.status).to.equal(404)
    chai.expect(getUserId.body.message).to.equal('Usuario no encontrado')

  })

  it('Debería seguir a un usuario', async () => {
    const userToFollow = await User.create({
      username: 'userToFollow',
      email: 'followme@example.com',
      password: '1234',
    });

    const res = await request
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToFollow: userToFollow._id });

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('message', 'Usuario seguido correctamente');
  });

  it('Debería devolver un error si intentas seguir a un usuario que ya sigues', async () => {
    const userToFollow = await User.create({
      username: 'userToFollow2',
      email: 'alreadyfollowing@example.com',
      password: '1234',
    });

    // Seguir al usuario por primera vez
    await request
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToFollow: userToFollow._id });

    // Intentar seguir al mismo usuario nuevamente
    const res = await request
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToFollow: userToFollow._id });

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body).to.have.property('message', 'Ya sigues a este usuario');
  });

  it('Debería dejar de seguir a un usuario', async () => {
    const userToUnfollow = await User.create({
      username: 'userToUnfollow',
      email: 'unfollowme@example.com',
      password: '1234',
    });

    // Seguir al usuario antes de dejar de seguirlo
    await request
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToFollow: userToUnfollow._id });

    // Dejar de seguir al usuario
    const res = await request
      .post('/api/users/unfollow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToUnfollow: userToUnfollow._id });

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('message', 'Has dejado de seguir al usuario');
  });

  it('Debería devolver un error si intentas dejar de seguir a un usuario que no sigues', async () => {
    const userToUnfollow = await User.create({
      username: 'userNotFollowed',
      email: 'neverfollowed@example.com',
      password: '1234',
    });

    const res = await request
      .post('/api/users/unfollow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToUnfollow: userToUnfollow._id });

    chai.expect(res.status).to.equal(400);
    chai.expect(res.body).to.have.property('message', 'No sigues a este usuario');
  });

  it('Debería devolver un error si el usuario a seguir no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToFollow: fakeId });

    chai.expect(res.status).to.equal(404);
    chai.expect(res.body).to.have.property('message', 'Usuario no encontrado');
  });

  it('Debería devolver un error si el usuario a dejar de seguir no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .post('/api/users/unfollow')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userIdToUnfollow: fakeId });

    chai.expect(res.status).to.equal(404);
    chai.expect(res.body).to.have.property('message', 'Usuario no encontrado');
  });

  it('Debería obtener los seguidores de un usuario', async () => {
    const user = await User.create({
      username: 'userWithFollowers',
      email: 'withfollowers@example.com',
      password: '1234',
    });

    const follower = await User.create({
      username: 'followerUser',
      email: 'follower@example.com',
      password: '1234',
    });

    user.followers.push(follower._id);
    await user.save();

    const res = await request
      .get(`/api/users/${user._id}/followers`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array');
    chai.expect(res.body[0]).to.have.property('username', 'followerUser');
  });

  it('Debería devolver un error si el usuario no tiene seguidores', async () => {
    const user = await User.create({
      username: 'userWithoutFollowers',
      email: 'withoutfollowers@example.com',
      password: '1234',
    });

    const res = await request
      .get(`/api/users/${user._id}/followers`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.is.empty;
  });

  it('Debería devolver un error 404 si el usuario no existe al obtener seguidores', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .get(`/api/users/${fakeId}/followers`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(404);
    chai.expect(res.body).to.have.property('message', 'Usuario no encontrado');
  });

  it('Debería obtener los seguidos de un usuario', async () => {
    const user = await User.create({
      username: 'userWithFollowing',
      email: 'withfollowing@example.com',
      password: '1234',
    });

    const following = await User.create({
      username: 'followingUser',
      email: 'following@example.com',
      password: '1234',
    });

    user.following.push(following._id);
    await user.save();

    const res = await request
      .get(`/api/users/${user._id}/following`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array');
    chai.expect(res.body[0]).to.have.property('username', 'followingUser');
  });

  it('Debería devolver un error si el usuario no sigue a nadie', async () => {
    const user = await User.create({
      username: 'userWithoutFollowing',
      email: 'withoutfollowing@example.com',
      password: '1234',
    });

    const res = await request
      .get(`/api/users/${user._id}/following`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array').that.is.empty;
  });

  it('Debería devolver un error 404 si el usuario no existe al obtener seguidos', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .get(`/api/users/${fakeId}/following`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(404);
    chai.expect(res.body).to.have.property('message', 'Usuario no encontrado');
  });

  it('Debería crear un nuevo usuario con autenticación y rol de administrador', async () => {
    const newUser = {
      username: 'newUser',
      email: 'newuser@example.com',
      password: '1234',
    };

    const res = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser);

    chai.expect(res.status).to.equal(201);
    chai.expect(res.body).to.include({ username: 'newUser', email: 'newuser@example.com' });
  });

  it('Debería obtener todos los usuarios', async () => {
    const res = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an('array');
  });

  it('Debería obtener un usuario por su username', async () => {
    const user = await User.create({
      username: 'searchUser',
      email: 'searchuser@example.com',
      password: '1234',
    });

    const res = await request
      .get(`/api/users?username=${user.username}`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('username', 'searchUser');
  });

  it('Debería actualizar un usuario por ID con autenticación y rol de administrador', async () => {
    const user = await User.create({
      username: 'updateUser',
      email: 'updateuser@example.com',
      password: '1234',
    });

    const updatedData = { name: 'Updated Name' };

    const res = await request
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('name', 'Updated Name');
  });

  it('No debería permitir modificar el email o username de un usuario', async () => {
    const user = await User.create({
      username: 'immutableUser',
      email: 'immutableuser@example.com',
      password: '1234',
    });

    const updateEmail = { email: 'newemail@example.com' };
    const updateUsername = { username: 'newUsername' };

    const resEmail = await request
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateEmail);

    chai.expect(resEmail.status).to.equal(400);
    chai.expect(resEmail.body).to.have.property('error', 'No se puede modificar el usuario');

    const resUsername = await request
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateUsername);

    chai.expect(resUsername.status).to.equal(400);
    chai.expect(resUsername.body).to.have.property('error', 'No se puede modificar el email');
  });

  it('Debería eliminar un usuario por ID con autenticación y rol de administrador', async () => {
    const user = await User.create({
      username: 'deleteUser',
      email: 'deleteuser@example.com',
      password: '1234',
    });

    const res = await request
      .delete(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('message', 'Usuario y coches asociados borrados');
  });

  it('Debería devolver un error 404 al intentar eliminar un usuario que no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .delete(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    chai.expect(res.status).to.equal(404);
    chai.expect(res.body).to.have.property('message', 'Usuario no encontrado');
  });

});
