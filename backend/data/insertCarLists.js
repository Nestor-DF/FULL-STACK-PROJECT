const User = require('../models/User')
const Car = require('../models/Car')
const CarList = require('../models/CarList')

const insertCarLists = async () => {
  const users = await User.find()
  const cars = await Car.find()

  const carsList = [{
    listName: "Mis tres coches favoritos",
    user: users[0]._id,
    cars: [cars[0]._id, cars[1]._id, cars[2]._id],
  }, {
    listName: "Lista pequeña pero potente",
    user: users[1]._id,
    cars: [cars[4]._id, cars[5]._id],
    posted: true,
    comments: [{
      user: users[0].username,
      comment: "¡Guau, que lista más increíble!"
    }],
    ratings: 10
  }, {
    listName: "Los tres mosqueteros",
    user: users[1]._id,
    cars: [cars[1]._id, cars[2]._id, cars[3]._id],
    posted: true,
    comments: [{
      user: users[0].username,
      comment: "¡Esta está incluso mejor!"
    }],
    ratings: 20
  }, {
    listName: "Insuperables",
    user: users[2]._id,
    cars: [cars[6]._id, cars[20]._id],
    posted: true,
    comments: [{
      user: users[5].username,
      comment: "Flipante"
    }, {
      user: users[6].username,
      comment: 'No te creo xd'
    }],
    ratings: 15
  }, {
    listName: "Todo preferidos",
    user: users[3]._id,
    cars: [cars[7]._id, cars[8]._id, cars[9]._id, cars[10]._id],
    posted: true,
    comments: [
      {
        user: users[0].username,
        comment: "¡Siempre soñé con estos coches!",
      },
    ],
    ratings: 8,
  },
  {
    listName: "El trío dinámico",
    user: users[4]._id,
    cars: [cars[2]._id, cars[5]._id, cars[10]._id],
    posted: false,
    comments: [],
    ratings: 0,
  },
  {
    listName: "Clásicos renovados",
    user: users[5]._id,
    cars: [cars[11]._id, cars[12]._id, cars[13]._id],
    posted: true,
    comments: [
      {
        user: users[2].username,
        comment: "Nada como los clásicos.",
      },
      {
        user: users[3].username,
        comment: "Totalmente de acuerdo.",
      },
    ],
    ratings: 18,
  },
  {
    listName: "Lujo al máximo",
    user: users[6]._id,
    cars: [cars[14]._id, cars[15]._id],
    posted: true,
    comments: [
      {
        user: users[5].username,
        comment: "Quiero uno de estos.",
      },
    ],
    ratings: 25,
  },
  {
    listName: "Velocidad extrema",
    user: users[7]._id,
    cars: [cars[16]._id, cars[17]._id, cars[18]._id, cars[19]._id],
    posted: false,
    comments: [],
    ratings: 0,
  },
  {
    listName: "Favoritos de la comunidad",
    user: users[8]._id,
    cars: [cars[20]._id, cars[21]._id, cars[22]._id],
    posted: true,
    comments: [
      {
        user: users[1].username,
        comment: "Estos coches son una maravilla.",
      },
      {
        user: users[4].username,
        comment: "No podría estar más de acuerdo.",
      },
    ],
    ratings: 30,
  },
  {
    listName: "Potencia y estilo",
    user: users[9]._id,
    cars: [cars[23]._id, cars[24]._id, cars[25]._id],
    posted: true,
    comments: [
      {
        user: users[2].username,
        comment: "¡Qué buen gusto tienes!",
      },
    ],
    ratings: 12,
  },
  {
    listName: "Aventureros",
    user: users[10]._id,
    cars: [cars[26]._id, cars[27]._id, cars[28]._id],
    posted: false,
    comments: [],
    ratings: 0,
  }, {
    listName: "Confiables",
    user: users[0]._id,
    cars: [cars[0]._id, cars[5]._id, cars[9]._id],
    posted: true,
    comments: [
      {
        user: users[3].username,
        comment: "Son perfectos.",
      },
      {
        user: users[4].username,
        comment: "¡Los coches ideales!",
      },
    ],
    ratings: 12,
  },
  {
    listName: "Deportivos legendarios",
    user: users[2]._id,
    cars: [cars[8]._id, cars[13]._id, cars[20]._id],
    posted: true,
    comments: [
      {
        user: users[0].username,
        comment: "La lista que todos quieren tener.",
      },
    ],
    ratings: 28,
  },
  {
    listName: "Para mi",
    user: users[4]._id,
    cars: [cars[11]._id, cars[15]._id, cars[18]._id],
    posted: false,
    comments: [],
    ratings: 0,
  },
  {
    listName: "Rendimiento top",
    user: users[7]._id,
    cars: [cars[3]._id, cars[10]._id, cars[25]._id],
    posted: true,
    comments: [
      {
        user: users[6].username,
        comment: "¡Un rendimiento espectacular!",
      },
      {
        user: users[8].username,
        comment: "Necesito probar estos coches.",
      },
    ],
    ratings: 19,
  },
  {
    listName: "Coches de película",
    user: users[5]._id,
    cars: [cars[12]._id, cars[17]._id, cars[23]._id],
    posted: true,
    comments: [
      {
        user: users[1].username,
        comment: "Salen en todas mis películas favoritas.",
      },
      {
        user: users[9].username,
        comment: "¡Impresionantes diseños!",
      },
    ],
    ratings: 35,
  },
  {
    listName: "Compactos modernos",
    user: users[3]._id,
    cars: [cars[0]._id, cars[6]._id, cars[14]._id],
    posted: false,
    comments: [],
    ratings: 0,
  },
  {
    listName: "Rarezas exclusivas",
    user: users[6]._id,
    cars: [cars[19]._id, cars[21]._id, cars[27]._id],
    posted: true,
    comments: [
      {
        user: users[2].username,
        comment: "No sabía que estos existían.",
      },
      {
        user: users[8].username,
        comment: "Colección impresionante.",
      },
    ],
    ratings: 22,
  },
  {
    listName: "Off-road extremos",
    user: users[10]._id,
    cars: [cars[7]._id, cars[16]._id, cars[24]._id],
    posted: true,
    comments: [
      {
        user: users[5].username,
        comment: "¿Listo para la aventura? Yo sí.",
      },
    ],
    ratings: 14,
  },
  {
    listName: "Vehículos conceptuales",
    user: users[9]._id,
    cars: [cars[2]._id, cars[18]._id, cars[28]._id],
    posted: true,
    comments: [
      {
        user: users[7].username,
        comment: "Estos parecen sacados del futuro.",
      },
    ],
    ratings: 16,
  },
  {
    listName: "La colección soñada",
    user: users[1]._id,
    cars: [cars[4]._id, cars[9]._id, cars[22]._id],
    posted: false,
    comments: [],
    ratings: 0,
  },
  {
    listName: "Mis coches :)",
    user: users[8]._id,
    cars: [cars[0]._id, cars[5]._id, cars[15]._id],
    posted: true,
    comments: [
      {
        user: users[3].username,
        comment: "DAMELOS",
      },
      {
        user: users[6].username,
        comment: "Elecciones inteligentes.",
      },
    ],
    ratings: 24,
  }, {
    listName: "Máquinas poderosas",
    user: users[0]._id,
    cars: [cars[0]._id, cars[10]._id, cars[20]._id, cars[30]._id, cars[40]._id],
    posted: true,
    comments: [
      { user: users[2].username, comment: "¡Pura potencia!" },
      { user: users[4].username, comment: "Una selección espectacular." },
      { user: users[5].username, comment: "Esos coches son mis favoritos." },
      { user: users[8].username, comment: "Quiero uno de cada." },
    ],
    ratings: 25,
  },
  {
    listName: "Compactos perfectos",
    user: users[1]._id,
    cars: [cars[30]._id, cars[31]._id, cars[32]._id, cars[33]._id, cars[34]._id],
    posted: false,
    comments: [
      { user: users[7].username, comment: "¡Ideales para la ciudad!" },
      { user: users[9].username, comment: "Son geniales." },
    ],
    ratings: 12,
  },
  {
    listName: "Clásicos inolvidables",
    user: users[2]._id,
    cars: [cars[40]._id, cars[41]._id, cars[42]._id, cars[43]._id, cars[44]._id],
    posted: true,
    comments: [
      { user: users[0].username, comment: "Me encantan los clásicos." },
      { user: users[3].username, comment: "Increíble colección." },
      { user: users[6].username, comment: "Esto sí que tiene clase." },
    ],
    ratings: 30,
  },
  {
    listName: "Todo terreno",
    user: users[3]._id,
    cars: [cars[50]._id, cars[51]._id, cars[52]._id, cars[53]._id],
    posted: true,
    comments: [
      { user: users[5].username, comment: "¡Perfectos para aventuras!" },
      { user: users[2].username, comment: "Quiero probar estos en las montañas." },
    ],
    ratings: 20,
  },
  {
    listName: "Lujo inigualable",
    user: users[4]._id,
    cars: [cars[60]._id, cars[61]._id, cars[62]._id, cars[63]._id, cars[64]._id],
    posted: true,
    comments: [
      { user: users[6].username, comment: "Esto es lo que quiero en mi garaje." },
      { user: users[7].username, comment: "Una lista impresionante." },
      { user: users[9].username, comment: "¡Lujo en su máxima expresión!" },
    ],
    ratings: 40,
  },
  {
    listName: "Velocidad máxima",
    user: users[5]._id,
    cars: [cars[70]._id, cars[71]._id, cars[72]._id, cars[73]._id, cars[74]._id],
    posted: true,
    comments: [
      { user: users[8].username, comment: "Nada supera esta velocidad." },
      { user: users[9].username, comment: "¡Me encantaría probar uno de estos!" },
      { user: users[1].username, comment: "Impresionantes autos." },
    ],
    ratings: 35,
  },
  {
    listName: "Favoritos urbanos",
    user: users[6]._id,
    cars: [cars[80]._id, cars[81]._id, cars[82]._id, cars[83]._id],
    posted: false,
    comments: [
      { user: users[4].username, comment: "¡Perfectos para el día a día!" },
    ],
    ratings: 10,
  },
  {
    listName: "Energía pura",
    user: users[7]._id,
    cars: [cars[90]._id, cars[91]._id, cars[92]._id, cars[93]._id, cars[94]._id],
    posted: true,
    comments: [
      { user: users[3].username, comment: "Potencia en estado puro." },
      { user: users[10].username, comment: "¡Increíble selección!" },
      { user: users[2].username, comment: "Son impresionantes." },
    ],
    ratings: 28,
  },
  {
    listName: "Lo mejor del futuro",
    user: users[8]._id,
    cars: [cars[100]._id, cars[101]._id, cars[102]._id, cars[103]._id],
    posted: true,
    comments: [
      { user: users[1].username, comment: "Esto es futurismo." },
      { user: users[6].username, comment: "Diseños increíbles." },
      { user: users[5].username, comment: "¡Auténticas obras de arte!" },
    ],
    ratings: 32,
  },
  {
    listName: "Rendimiento y estilo",
    user: users[9]._id,
    cars: [cars[110]._id, cars[111]._id, cars[112]._id, cars[113]._id, cars[114]._id],
    posted: false,
    comments: [
      { user: users[8].username, comment: "Excelentes elecciones." },
    ],
    ratings: 15,
  },
  {
    listName: "Edición limitada",
    user: users[10]._id,
    cars: [cars[120]._id, cars[121]._id, cars[122]._id, cars[123]._id, cars[124]._id],
    posted: true,
    comments: [
      { user: users[0].username, comment: "¡Impresionante!" },
      { user: users[2].username, comment: "¿Dónde puedo conseguir uno?" },
      { user: users[4].username, comment: "Son piezas únicas." },
    ],
    ratings: 45,
  }, {
    listName: "Supercoches de ensueño",
    user: users[0]._id,
    cars: [
      cars[0]._id, cars[1]._id, cars[2]._id, cars[3]._id, cars[4]._id,
      cars[5]._id, cars[6]._id, cars[7]._id, cars[8]._id, cars[9]._id
    ],
    posted: true,
    comments: [
      { user: users[1].username, comment: "¡Impresionante lista!" },
      { user: users[2].username, comment: "Quiero todos estos coches." },
      { user: users[3].username, comment: "Un sueño hecho realidad." },
      { user: users[4].username, comment: "¿Dónde los puedo comprar?" },
      { user: users[5].username, comment: "Increíble selección." },
      { user: users[6].username, comment: "¡Espectaculares!" },
      { user: users[7].username, comment: "Estos coches son leyenda." },
      { user: users[8].username, comment: "La lista definitiva." },
    ],
    ratings: 45,
  },
  {
    listName: "Clásicos icónicos",
    user: users[2]._id,
    cars: [
      cars[10]._id, cars[11]._id, cars[12]._id, cars[13]._id, cars[14]._id,
      cars[15]._id, cars[16]._id, cars[17]._id, cars[18]._id, cars[19]._id
    ],
    posted: true,
    comments: [
      { user: users[0].username, comment: "Nada como los clásicos." },
      { user: users[3].username, comment: "Unos coches que nunca pasan de moda." },
      { user: users[5].username, comment: "Cada uno de ellos es especial." },
      { user: users[6].username, comment: "Perfectos para coleccionistas." },
      { user: users[7].username, comment: "Me transportan a otra época." },
      { user: users[8].username, comment: "Los quiero todos." },
      { user: users[9].username, comment: "Un tributo a la historia del automóvil." },
      { user: users[10].username, comment: "Increíble selección, digna de admirar." },
    ],
    ratings: 50,
  },
  {
    listName: "Aventura extrema",
    user: users[4]._id,
    cars: [
      cars[20]._id, cars[21]._id, cars[22]._id, cars[23]._id, cars[24]._id,
      cars[25]._id, cars[26]._id, cars[27]._id, cars[28]._id, cars[29]._id
    ],
    posted: true,
    comments: [
      { user: users[1].username, comment: "Perfectos para salir de la ciudad." },
      { user: users[2].username, comment: "Una lista ideal para aventureros." },
      { user: users[5].username, comment: "¡Quiero probar uno de estos!" },
      { user: users[6].username, comment: "Están listos para cualquier terreno." },
      { user: users[7].username, comment: "La aventura está asegurada." },
      { user: users[8].username, comment: "Impresionante resistencia y estilo." },
      { user: users[9].username, comment: "¡Una lista épica!" },
      { user: users[10].username, comment: "Perfectos para explorar el mundo." },
    ],
    ratings: 40,
  }, {
    listName: "Futurismo sobre ruedas",
    user: users[6]._id,
    cars: [
      cars[30]._id, cars[31]._id, cars[32]._id, cars[33]._id, cars[34]._id,
      cars[35]._id, cars[36]._id, cars[37]._id, cars[38]._id, cars[39]._id
    ],
    posted: true,
    comments: [
      { user: users[2].username, comment: "Estos diseños son de otro mundo." },
      { user: users[3].username, comment: "Quiero conducir todos." },
      { user: users[7].username, comment: "Innovación al máximo." },
      { user: users[8].username, comment: "Un vistazo al futuro." },
      { user: users[9].username, comment: "Increíbles máquinas." },
      { user: users[10].username, comment: "¡Qué maravilla de coches!" },
      { user: users[0].username, comment: "Sorprendente selección." },
      { user: users[5].username, comment: "Una lista perfecta." },
    ],
    ratings: 42,
  },
  {
    listName: "Los reyes de la carretera",
    user: users[9]._id,
    cars: [
      cars[40]._id, cars[41]._id, cars[42]._id, cars[43]._id, cars[44]._id,
      cars[45]._id, cars[46]._id, cars[47]._id, cars[48]._id, cars[49]._id
    ],
    posted: true,
    comments: [
      { user: users[1].username, comment: "Nada supera a estos coches." },
      { user: users[3].username, comment: "Son los mejores en su clase." },
      { user: users[6].username, comment: "Los quiero todos en mi garaje." },
      { user: users[8].username, comment: "Una selección que inspira respeto." },
      { user: users[4].username, comment: "Me quedo con cualquiera de estos." },
      { user: users[7].username, comment: "Potencia y estilo en estado puro." },
      { user: users[10].username, comment: "¡Unos coches fuera de serie!" },
      { user: users[5].username, comment: "Simplemente extraordinarios." },
    ],
    ratings: 48,
  },
  {
    listName: "Compactos de lujo",
    user: users[7]._id,
    cars: [
      cars[50]._id, cars[51]._id, cars[52]._id, cars[53]._id, cars[54]._id,
      cars[55]._id, cars[56]._id, cars[57]._id, cars[58]._id, cars[59]._id
    ],
    posted: true,
    comments: [
      { user: users[0].username, comment: "Compactos pero con gran presencia." },
      { user: users[4].username, comment: "Perfectos para la ciudad." },
      { user: users[2].username, comment: "Eficiencia y lujo combinados." },
      { user: users[6].username, comment: "Unos coches muy versátiles." },
      { user: users[3].username, comment: "Diseños modernos y funcionales." },
      { user: users[9].username, comment: "Un compacto que querría tener." },
      { user: users[10].username, comment: "Elegancia en tamaño reducido." },
      { user: users[5].username, comment: "Gran lista de compactos." },
    ],
    ratings: 39,
  }, {
    listName: "SUVs para toda ocasión",
    user: users[3]._id,
    cars: [
      cars[60]._id, cars[61]._id, cars[62]._id, cars[63]._id, cars[64]._id,
      cars[65]._id, cars[66]._id, cars[67]._id, cars[68]._id, cars[69]._id
    ],
    posted: true,
    comments: [
      { user: users[1].username, comment: "Perfectos para la familia." },
      { user: users[6].username, comment: "Los mejores para largos viajes." },
      { user: users[2].username, comment: "Espaciosos y cómodos." },
      { user: users[7].username, comment: "La selección definitiva de SUVs." },
      { user: users[9].username, comment: "¡Quiero todos!" },
      { user: users[4].username, comment: "Perfectos para aventuras todoterreno." },
      { user: users[8].username, comment: "Unos modelos muy confiables." },
      { user: users[0].username, comment: "Diseños robustos y elegantes." },
    ],
    ratings: 44,
  },
  {
    listName: "Futuristas y eléctricos",
    user: users[5]._id,
    cars: [
      cars[70]._id, cars[71]._id, cars[72]._id, cars[73]._id, cars[74]._id,
      cars[75]._id, cars[76]._id, cars[77]._id, cars[78]._id, cars[79]._id
    ],
    posted: true,
    comments: [
      { user: users[1].username, comment: "La tecnología del futuro hoy." },
      { user: users[2].username, comment: "¡Qué innovación en estos coches!" },
      { user: users[3].username, comment: "Diseños que rompen esquemas." },
      { user: users[7].username, comment: "Eléctricos y totalmente impresionantes." },
      { user: users[0].username, comment: "Estos son el futuro de la movilidad." },
      { user: users[6].username, comment: "¡Coches que parecen de ciencia ficción!" },
      { user: users[4].username, comment: "Unos vehículos realmente revolucionarios." },
      { user: users[9].username, comment: "Cada uno de ellos es increíble." },
    ],
    ratings: 48,
  },
  {
    listName: "Deportivos de alto rendimiento",
    user: users[2]._id,
    cars: [
      cars[80]._id, cars[81]._id, cars[82]._id, cars[83]._id, cars[84]._id,
      cars[85]._id, cars[86]._id, cars[87]._id, cars[88]._id, cars[89]._id
    ],
    posted: true,
    comments: [
      { user: users[3].username, comment: "La velocidad en estado puro." },
      { user: users[5].username, comment: "Potencia y diseño en cada modelo." },
      { user: users[6].username, comment: "Unos deportivos que querría probar." },
      { user: users[8].username, comment: "Perfectos para la pista." },
      { user: users[1].username, comment: "Los mejores del mercado." },
      { user: users[4].username, comment: "La definición de alto rendimiento." },
      { user: users[7].username, comment: "No hay nada como estos coches." },
      { user: users[10].username, comment: "Coches para amantes de la velocidad." },
    ],
    ratings: 52,
  },
  {
    listName: "Coches familiares confiables",
    user: users[4]._id,
    cars: [
      cars[90]._id, cars[91]._id, cars[92]._id, cars[93]._id, cars[94]._id,
      cars[95]._id, cars[96]._id, cars[97]._id, cars[98]._id, cars[99]._id
    ],
    posted: true,
    comments: [
      { user: users[0].username, comment: "Perfectos para toda la familia." },
      { user: users[3].username, comment: "Espaciosos y seguros." },
      { user: users[5].username, comment: "Los mejores para largos viajes." },
      { user: users[6].username, comment: "Unos coches muy prácticos." },
      { user: users[9].username, comment: "Elegancia y funcionalidad en uno." },
      { user: users[7].username, comment: "Lista muy bien pensada." },
      { user: users[1].username, comment: "Unos modelos muy confiables." },
      { user: users[2].username, comment: "Seguridad y comodidad garantizadas." },
    ],
    ratings: 38,
  },
  {
    listName: "Todo terreno legendarios",
    user: users[9]._id,
    cars: [
      cars[100]._id, cars[101]._id, cars[102]._id, cars[103]._id, cars[104]._id,
      cars[105]._id, cars[106]._id, cars[107]._id, cars[108]._id, cars[109]._id
    ],
    posted: true,
    comments: [
      { user: users[6].username, comment: "Estos coches dominan cualquier terreno." },
      { user: users[4].username, comment: "¡Unos todoterreno increíbles!" },
      { user: users[5].username, comment: "Resistentes y confiables." },
      { user: users[3].username, comment: "Perfectos para aventuras extremas." },
      { user: users[1].username, comment: "Una selección espectacular." },
      { user: users[0].username, comment: "Lista digna de un explorador." },
      { user: users[2].username, comment: "Coches para conquistar cualquier lugar." },
      { user: users[8].username, comment: "Unos modelos legendarios." },
    ],
    ratings: 42,
  },
  {
    listName: "Lujo y exclusividad",
    user: users[8]._id,
    cars: [
      cars[110]._id, cars[111]._id, cars[112]._id, cars[113]._id, cars[114]._id,
      cars[115]._id, cars[116]._id, cars[117]._id, cars[118]._id, cars[119]._id
    ],
    posted: true,
    comments: [
      { user: users[5].username, comment: "Coches que destilan lujo." },
      { user: users[4].username, comment: "Diseños impresionantes." },
      { user: users[1].username, comment: "Exclusivos y elegantes." },
      { user: users[6].username, comment: "Cada uno es una obra de arte." },
      { user: users[7].username, comment: "El estándar del lujo." },
      { user: users[3].username, comment: "Un sueño hecho realidad." },
      { user: users[10].username, comment: "Increíbles por donde los mires." },
      { user: users[2].username, comment: "Quiero todos estos coches." },
    ],
    ratings: 55,
  }
  ]

  const insertedList = await CarList.insertMany(carsList)

  for (const list of insertedList) {
    await User.findByIdAndUpdate(list.user, {
      $push: { carsList: list._id },
    });
  }

}

module.exports = insertCarLists