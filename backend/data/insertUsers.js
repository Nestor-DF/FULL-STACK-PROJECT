const User = require('../models/User')
const Image = require('../models/Image')

const insertUsers = async () => {
  const images = await Image.find()
  const users = [
    {
      avatar: images[0]._id,
      carsList: [],
      likedLists: [],
      username: "nestor",
      name: "Nestor Feliciano",
      password: "1234",
      email: "nestor@gmail.com",
      role: "admin"
    },
    {
      avatar: images[0]._id,
      carsList: [],
      likedLists: [],
      username: "maria_89",
      name: "Maria Lopez",
      password: "mariapass",
      email: "maria.lopez@gmail.com"
    },
    {
      avatar: images[1]._id,
      carsList: [],
      likedLists: [],
      username: "juanito_77",
      name: "Juan Perez",
      password: "juanpass",
      email: "juan.perez@gmail.com"
    },
    {
      avatar: images[2]._id,
      carsList: [],
      likedLists: [],
      username: "laura23",
      name: "Laura Martin",
      password: "laurapass",
      email: "laura.martin@gmail.com"
    },
    {
      avatar: images[3]._id,
      carsList: [],
      likedLists: [],
      username: "carlos_lc",
      name: "Carlos Lopez",
      password: "carlospass",
      email: "carlos.lopez@gmail.com"
    },
    {
      avatar: images[4]._id,
      carsList: [],
      likedLists: [],
      username: "ana_rz",
      name: "Ana Rodriguez",
      password: "anapass",
      email: "ana.rodriguez@gmail.com"
    },
    {
      avatar: images[5]._id,
      carsList: [],
      likedLists: [],
      username: "luis78",
      name: "Luis Fernandez",
      password: "luispass",
      email: "luis.fernandez@gmail.com"
    },
    {
      avatar: images[6]._id,
      carsList: [],
      likedLists: [],
      username: "lucia.m",
      name: "Lucia Martinez",
      password: "luciapass",
      email: "lucia.martinez@gmail.com"
    },
    {
      avatar: images[7]._id,
      carsList: [],
      likedLists: [],
      username: "jorge_92",
      name: "Jorge Garcia",
      password: "jorgepass",
      email: "jorge.garcia@gmail.com"
    },
    {
      avatar: images[0]._id,
      carsList: [],
      likedLists: [],
      username: "beatriz_bz",
      name: "Beatriz Gonzalez",
      password: "beatrizpass",
      email: "beatriz.gonzalez@gmail.com"
    },
    {
      avatar: images[1]._id,
      carsList: [],
      likedLists: [],
      username: "pedro_smith",
      name: "Pedro Smith",
      password: "pedropass",
      email: "pedro.smith@gmail.com"
    }
  ]

  for (const userData of users) {
    const user = new User(userData)
    await user.save()
  }
}

module.exports = insertUsers