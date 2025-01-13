const Car = require('../models/Car');
const CarList = require('../models/CarList')
const User = require('../models/User')

exports.filterCars = async (req, res) => {
  try {
    const {
      brands,
      countries,
      fuelTypes,
      tractionTypes,
      price,
      speed,
      manufactureYear,
      string_clave,
    } = req.body;

    const { page = 1, pageSize = 10 } = req.query;

    const filter = {};

    if (brands && brands.length > 0) {
      filter.brand = { $in: brands };
    }

    if (countries && countries.length > 0) {
      filter.country = { $in: countries };
    }

    if (fuelTypes && fuelTypes.length > 0) {
      filter.fuelType = { $in: fuelTypes };
    }

    if (tractionTypes && tractionTypes.length > 0) {
      filter.tractionType = { $in: tractionTypes };
    }

    if (price) {
      filter.startingPrice = {};
      if (price.min) filter.startingPrice.$gte = price.min;
      if (price.max) filter.startingPrice.$lte = price.max;
    }

    if (speed) {
      filter.maximumSpeed = {};
      if (speed.min) filter.maximumSpeed.$gte = speed.min;
      if (speed.max) filter.maximumSpeed.$lte = speed.max;
    }

    if (manufactureYear) {
      filter.manufactureYear = {};
      if (manufactureYear.min) filter.manufactureYear.$gte = manufactureYear.min;
      if (manufactureYear.max) filter.manufactureYear.$lte = manufactureYear.max;
    }

    let query = Car.find(filter);

    if (string_clave) {
      const regex = new RegExp(string_clave, 'i');
      query = query.find({
        $or: [
          { brand: regex },
          { model: regex },
          { description: regex },
        ],
      });
    }

    const totalResults = await query.clone().countDocuments();

    // Aplicar paginación
    const cars = await query
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    res.status(200).json({
      cars,
      totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / pageSize),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener una cantidad de coches randoms
// (query: ?limit= -> número de coches) : Devuelve coches random con respecto a ese número(por defecto 5)
exports.getCarRandom = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5

    const randomCars = await Car.aggregate([
      { $sample: { size: limit } }
    ])

    res.status(200).json(randomCars)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Obtener un coche por ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Coche no encontrado' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCarMetadata = async (req, res) => {
  try {
    const [brands, countries, fuelTypes, tractionTypes, minPrice, maxPrice, maxSpeed, minYear, maxYear] = await Promise.all([
      Car.distinct('brand').then((data) => data.sort((a, b) => a.localeCompare(b))), // Obtener y ordenar marcas
      Car.distinct('country').then((data) => data.sort((a, b) => a.localeCompare(b))), // Obtener y ordenar países
      Car.distinct('fuelType').then((data) => data.sort((a, b) => a.localeCompare(b))), // Obtener y ordenar tipos de combustible
      Car.distinct('tractionType').then((data) => data.sort((a, b) => a.localeCompare(b))), // Obtener y ordenar tipos de tracción
      Car.find().sort({ startingPrice: 1 }).limit(1).then((cars) => cars[0]?.startingPrice || null), // Precio mínimo
      Car.find().sort({ startingPrice: -1 }).limit(1).then((cars) => cars[0]?.startingPrice || null), // Precio máximo
      Car.find().sort({ maximumSpeed: -1 }).limit(1).then((cars) => cars[0]?.maximumSpeed || null), // Velocidad máxima
      Car.find().sort({ manufactureYear: 1 }).limit(1).then((cars) => cars[0]?.manufactureYear || null), // Año mínimo
      Car.find().sort({ manufactureYear: -1 }).limit(1).then((cars) => cars[0]?.manufactureYear || null), // Año máximo
    ]);

    res.status(200).json({
      brands,
      countries,
      fuelTypes,
      tractionTypes,
      price: { min: minPrice, max: maxPrice },
      maximumSpeed: maxSpeed,
      manufactureYear: { min: minYear, max: maxYear },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear un nuevo coche
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Actualizar un coche por ID
exports.updateCarById = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) {
      return res.status(404).json({ message: 'Coche no encontrado' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Eliminar un coche por ID
exports.deleteCarById = async (req, res) => {
  const carId = req.params.id;

  try {
    // Eliminar el coche de la colección 'Car'
    const car = await Car.findByIdAndDelete(carId);
    if (!car) {
      return res.status(404).json({ message: 'Coche no encontrado' });
    }

    // Obtener todas las listas que contienen este coche
    const carLists = await CarList.find({ cars: carId });

    // Listas que van a ser eliminadas
    const listsToDelete = [];

    for (const list of carLists) {
      // Eliminar el coche de la lista
      list.cars = list.cars.filter((id) => id.toString() !== carId);

      // Si la lista queda vacía, marcar para eliminación
      if (list.cars.length === 0) {
        listsToDelete.push(list._id);
        await CarList.findByIdAndDelete(list._id);
      } else {
        await list.save();
      }
    }

    // Actualizar a los usuarios para eliminar las listas vacías
    if (listsToDelete.length > 0) {
      await User.updateMany(
        { carsList: { $in: listsToDelete } },
        { $pull: { carsList: { $in: listsToDelete } } }
      );
    }

    res.status(200).json({ message: 'Coche y referencias eliminadas correctamente' });
  } catch (error) {
    console.error('Error al eliminar el coche:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
