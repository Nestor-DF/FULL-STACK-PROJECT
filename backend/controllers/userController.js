const User = require('../models/User');
const CarList = require('../models/CarList');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Image = require('../models/Image');


exports.signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Usuario ya registrado' });

    const images = await Image.find({});
    if (!images.length) {
      return res.status(500).json({ message: 'No hay imágenes disponibles para asignar como avatar.' });
    }
    const randomAvatar = images[Math.floor(Math.random() * images.length)];

    user = new User({
      username: username,
      password: password,
      email: email,
      avatar: randomAvatar._id,
      name: username,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email incorrecto' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserInfo = async (req, res) => {
  try {
    // `req.user` fue rellenado por el middleware `auth`
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('avatar', 'name linkImage') // Popula el avatar con los campos 'name' y 'linkImage'
      .populate({
        path: 'carsList',
      })
      .populate({
        path: 'likedLists',
      })
      .select('-password'); // Excluye 'password'

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.likeList = async (req, res) => {
  try {
    const { listId } = req.body; // ID de la lista enviada desde el frontend
    const userId = req.user.id; // ID del usuario desde el token JWT

    const user = await User.findById(userId);
    const carList = await CarList.findById(listId);

    if (!user || !carList) {
      return res.status(404).json({ message: 'Usuario o lista no encontrados' });
    }

    if (user.likedLists.includes(listId)) {
      return res.status(400).json({ message: 'Ya diste "me gusta" a esta lista' });
    }

    user.likedLists.push(listId);
    await user.save();

    carList.ratings += 1;
    await carList.save();

    res.status(200).json({ message: '"Me gusta" agregado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.dislikeList = async (req, res) => {
  try {
    const { listId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const carList = await CarList.findById(listId);

    if (!user || !carList) {
      return res.status(404).json({ message: 'Usuario o lista no encontrados' });
    }

    // Verifica si el usuario no ha dado "me gusta" antes
    if (!user.likedLists.includes(listId)) {
      return res.status(400).json({ message: 'No has dado "me gusta" a esta lista' });
    }

    user.likedLists = user.likedLists.filter((id) => id.toString() !== listId);
    await user.save();

    if (carList.ratings > 0) {
      carList.ratings -= 1;
      await carList.save();
    }

    res.status(200).json({ message: '"Me gusta" eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.isListLiked = async (req, res) => {
  try {
    const { listId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const carList = await CarList.findById(listId);

    if (!user || !carList) {
      return res.status(404).json({ message: 'Usuario o lista no encontrados' });
    }

    // Verifica si el usuario ha dado "me gusta" antes
    if (user.likedLists.includes(listId)) {
      return res.status(200).json({ isLiked: true });
    } else {
      return res.status(200).json({ isLiked: false });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('avatar', 'name linkImage') // Popula el avatar con los campos 'name' y 'linkImage'
      .populate({
        path: 'carsList',
        match: { posted: true },
      })
      .populate({
        path: 'likedLists',
      })
      .select('-password -email'); // Excluye los campos 'password' y 'email'

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.modifyUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const { avatarId, name, email } = req.body

    if (avatarId) user.avatar = avatarId
    if (name) user.name = name
    if (email) user.email = email

    await user.save()

    res.status(200).json({ message: 'Usuario modificado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.followUser = async (req, res) => {
  const { userIdToFollow } = req.body; // ID del usuario que se desea seguir
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userIdToFollow);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: 'Ya sigues a este usuario' });
    }

    user.following.push(userIdToFollow);
    userToFollow.followers.push(userId);

    await user.save();
    await userToFollow.save();

    res.status(200).json({ message: 'Usuario seguido correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.unfollowUser = async (req, res) => {
  const { userIdToUnfollow } = req.body; // ID del usuario que se desea dejar de seguir
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userIdToUnfollow);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!user.following.includes(userIdToUnfollow)) {
      return res.status(400).json({ message: 'No sigues a este usuario' });
    }

    user.following = user.following.filter(id => id.toString() !== userIdToUnfollow);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

    await user.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'Has dejado de seguir al usuario' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFollowers = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate('followers', 'username avatar');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFollowing = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate('following', 'username avatar');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Obtener todos los usuarios
// (query: ?username= -> nombre username) : Devuelve el usuario por ese username
exports.getUsers = async (req, res) => {
  try {

    let user

    if (req.query.username) {
      user = await User.findOne({ username: req.query.username })
    } else {
      user = await User.find()
    }

    res.status(200).json(user)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


exports.updateUserById = async (req, res) => {
  try {

    // Que solo se pueda modificar el email y el name(no el username y email)
    if (req.body.email) {
      return res.status(400).json({ error: 'No se puede modificar el usuario' })
    }

    if (req.body.username) {
      return res.status(400).json({ error: 'No se puede modificar el email' })
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};


exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Borrar todas las listas de coches asociadas a ese usuario
    await CarList.deleteMany({ user: user.id })

    await User.findByIdAndDelete(user.id)

    res.status(200).json({ message: 'Usuario y coches asociados borrados' })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}