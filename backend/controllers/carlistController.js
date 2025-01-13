const CarList = require('../models/CarList');
const User = require('../models/User');


exports.getCarListPublic = async (req, res) => {
  try {
    const publicLists = await CarList.find({ posted: true });
    res.status(200).json(publicLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.getCarListTopRated = async (req, res) => {
  try {
    const topRatedLists = await CarList.find({ posted: true }).sort({ ratings: -1 }).limit(10);
    res.status(200).json(topRatedLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.getCarListMostCommented = async (req, res) => {
  try {
    const mostCommentedLists = await CarList.aggregate([
      {
        $match: { posted: true },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
        },
      },
      {
        $sort: { commentCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    res.status(200).json(mostCommentedLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.getLatestCarLists = async (req, res) => {
  try {
    const latestLists = await CarList.find({ posted: true }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json(latestLists);
  } catch (error) {
    console.error('Error al obtener las últimas listas creadas:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getCarListRandom = async (req, res) => {
  try {
    const randomLists = await CarList.aggregate([
      { $match: { posted: true } },
      { $sample: { size: 10 } },
    ]);
    res.status(200).json(randomLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.createCarList = async (req, res) => {
  try {
    const carList = new CarList({
      ...req.body, // Otros campos de la lista, como `listName`, `cars`, etc.
      user: req.user.id, // Asociar automáticamente el usuario autenticado
    });

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.carsList.push(carList._id);

    await carList.save();
    await user.save();

    res.status(201).json(carList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.addCommentToCarList = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: 'El comentario es obligatorio' });
  }

  try {
    const carList = await CarList.findById(id);

    if (!carList) {
      return res.status(404).json({ message: 'Lista de coches no encontrada' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const newComment = {
      user: user.username,
      comment,
    };

    carList.comments.push(newComment);
    await carList.save();

    res.status(201).json({ message: 'Comentario añadido correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.deleteCarListById = async (req, res) => {
  try {
    const carList = await CarList.findById(req.params.id);

    if (!carList) {
      return res.status(404).json({ message: 'Lista de coches no encontrada' });
    }

    // Verificar que el usuario autenticado es el propietario de la lista
    if (carList.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta lista' });
    }

    const user = await User.findById(carList.user);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Quitar la lista de las referencias del usuario
    user.carsList = user.carsList.filter(listId => listId.toString() !== carList.id.toString());
    await user.save();

    await CarList.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Lista de coches eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.modifyCarListById = async (req, res) => {
  try {
    const carList = await CarList.findById(req.params.id);

    if (!carList) {
      return res.status(404).json({ message: 'Lista de coches no encontrada' });
    }

    // Verificar que el usuario autenticado es el propietario de la lista
    if (carList.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta lista' });
    }

    // Actualizar los campos de la lista con los datos proporcionados
    const { listName, cars, posted } = req.body;

    if (listName) carList.listName = listName;
    if (cars) carList.cars = cars;
    if (posted !== undefined) carList.posted = posted;
    await carList.save();

    res.status(200).json({ message: 'Lista de coches modificado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};