<template>

  <body>
    <Header />
    <main>
      <h1>Base de datos</h1>
      <div class="all-container">
        <div class="all-container-top">
          <button @click="openAddCar">Añadir coche</button>
          <MainSearchBar></MainSearchBar>
        </div>
        <div class="all-cars">
          <div class="all-cars-inner">
            <div class="car-parameters">
              <p>EDITAR </p>
              <p>BORRAR</p>
              <p>IMAGEN</p>
              <p>MARCA</p>
              <p>MODELO</p>
              <p>CATEGORÍA</p>
              <p>VELOCIDAD MÁX</p>
              <p>ACELERACIÓN</p>
              <p>PRECIO SALIDA</p>
              <p>TIPO COMBUSTIBLE</p>
              <p>MOTOR</p>
              <p>TRACCIÓN</p>
              <p>PAÍS</p>
              <p>AÑO FABRICACIÓN</p>
              <p>DESCRIPCIÓN</p>
            </div>
            <div v-for="(car, index) in carStore.cars" :key="index" class="car-container">
              <img src="../../public/icons/editar.png" alt="editar" class="icons" @click="openEditCar(index)">
              <img src="../../public/icons/borrar.png" alt="borrar" class="icons" @click="openDeleteCar(index)">
              <img :src="car.linkImage" :alt="car.model">
              <p>{{ car.brand }}</p>
              <p>{{ car.model }}</p>
              <p>{{ car.category }}</p>
              <p>{{ car.maximumSpeed }}</p>
              <p>{{ car.acceleration }}</p>
              <p>{{ car.startingPrice }}</p>
              <p>{{ car.fuelType }}</p>
              <p>{{ car.motorType }}</p>
              <p>{{ car.tractionType }}</p>
              <p>{{ car.country }}</p>
              <p>{{ car.manufactureYear }}</p>
              <div class="desc">
                <p>{{ car.description }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-if="showDeleteCar" class="overlay-background">
        <div class="overlay">
          <p>¿Estás seguro?</p>
          <div class="bottom-edit-content">
            <button @click="deleteCar">Eliminar</button>
            <button @click="closeDeleteCar">Cancelar</button>
          </div>
        </div>
      </div>

      <div v-if="showEditCar" class="overlay-background">
        <div class="overlay">
          <h3>Editar coche</h3>
          <div class="edit-container">
            <div class="edit-item">
              <p>Link imagen</p>
              <div class="edit-item-img">
                <img :src="editedCar.linkImage" :alt="editedCar.brand">
                <input v-model="editedCar.linkImage">
              </div>
            </div>

            <div class="edit-item">
              <p>Marca</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'brand')">
                  {{ editedCar.brand || 'Selecciona una marca' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.brand ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.brand" class="dropdown-list">
                  <li v-for="(brand, index) in carStore.brands" :key="index"
                    @click="editedCar.brand = brand; toggleDropdown(selectedCarIndex, 'brand')"
                    :class="{ selected: brand === editedCar.brand }">
                    {{ brand }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>Modelo</p>
              <input v-model="editedCar.model">
            </div>

            <div class="edit-item">
              <p>Categoría</p>
              <input v-model="editedCar.category">
            </div>

            <div class="edit-item">
              <p>Velocidad máxima</p>
              <input v-model="editedCar.maximumSpeed">
            </div>

            <div class="edit-item">
              <p>Aceleración</p>
              <input v-model="editedCar.acceleration">
            </div>


            <div class="edit-item">
              <p>Precio salida</p>
              <input v-model="editedCar.startingPrice">
            </div>

            <div class="edit-item">
              <p>Tipo combustible</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'fuelType')">
                  {{ editedCar.fuelType || 'Selecciona un tipo de combustible' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.fuelType ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.fuelType" class="dropdown-list">
                  <li v-for="(fuelType, index) in carStore.fuelTypes" :key="index"
                    @click="editedCar.fuelType = fuelType; toggleDropdown(selectedCarIndex, 'fuelType')"
                    :class="{ selected: fuelType === editedCar.fuelType }">
                    {{ fuelType }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>Motor</p>
              <input v-model="editedCar.motorType">
            </div>


            <div class="edit-item">
              <p>Tracción</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'tractionType')">
                  {{ editedCar.tractionType || 'Selecciona un tipo de tracción' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.tractionType ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.tractionType" class="dropdown-list">
                  <li v-for="(tractionType, index) in carStore.tractionTypes" :key="index"
                    @click="editedCar.tractionType = tractionType; toggleDropdown(selectedCarIndex, 'tractionType')"
                    :class="{ selected: tractionType === editedCar.tractionType }">
                    {{ tractionType }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>País</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'country')">
                  {{ editedCar.country || 'Selecciona un país' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.country ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.country" class="dropdown-list">
                  <li v-for="(country, index) in carStore.countries" :key="index"
                    @click="editedCar.country = country; toggleDropdown(selectedCarIndex, 'country')"
                    :class="{ selected: country === editedCar.country }">
                    {{ country }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>Año fabricación</p>
              <input v-model="editedCar.manufactureYear">
            </div>

            <div class="edit-item">
              <p>Descripción</p>
              <input v-model="editedCar.description">
            </div>

          </div>

          <div v-if="errorMessage" class="error-message">
            <p> {{ errorMessage }}</p>
          </div>

          <div class="bottom-edit-content">
            <button @click="editCar">Guardar</button>
            <button @click="closeEditCar">Cancelar</button>
          </div>
        </div>
      </div>


      <div v-if="showAddCar" class="overlay-background">
        <div class="overlay">
          <h3>Añadir coche</h3>

          <div class="edit-container">
            <div class="edit-item">
              <p>Link imagen</p>
              <div class="edit-item-img">
                <img :src="addedCar.linkImage" :alt="addedCar.brand">
                <input v-model="addedCar.linkImage" placeholder="https://imagen.png">
              </div>
            </div>

            <div class="edit-item">
              <p>Marca</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'brand')">
                  {{ addedCar.brand || 'Selecciona una marca' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.brand ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.brand" class="dropdown-list">
                  <li v-for="(brand, index) in carStore.brands" :key="index"
                    @click="addedCar.brand = brand; toggleDropdown(selectedCarIndex, 'brand')"
                    :class="{ selected: brand === addedCar.brand }">
                    {{ brand }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>Modelo</p>
              <input v-model="addedCar.model">
            </div>

            <div class="edit-item">
              <p>Categoría</p>
              <input v-model="addedCar.category">
            </div>

            <div class="edit-item">
              <p>Velocidad máxima</p>
              <input v-model="addedCar.maximumSpeed">
            </div>

            <div class="edit-item">
              <p>Aceleración</p>
              <input v-model="addedCar.acceleration">
            </div>


            <div class="edit-item">
              <p>Precio salida</p>
              <input v-model="addedCar.startingPrice">
            </div>

            <div class="edit-item">
              <p>Tipo combustible</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'fuelType')">
                  {{ addedCar.fuelType || 'Selecciona un tipo de combustible' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.fuelType ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.fuelType" class="dropdown-list">
                  <li v-for="(fuelType, index) in carStore.fuelTypes" :key="index"
                    @click="addedCar.fuelType = fuelType; toggleDropdown(selectedCarIndex, 'fuelType')"
                    :class="{ selected: fuelType === addedCar.fuelType }">
                    {{ fuelType }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>Motor</p>
              <input v-model="addedCar.motorType">
            </div>


            <div class="edit-item">
              <p>Tracción</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'tractionType')">
                  {{ addedCar.tractionType || 'Selecciona un tipo de tracción' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.tractionType ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.tractionType" class="dropdown-list">
                  <li v-for="(tractionType, index) in carStore.tractionTypes" :key="index"
                    @click="addedCar.tractionType = tractionType; toggleDropdown(selectedCarIndex, 'tractionType')"
                    :class="{ selected: tractionType === addedCar.tractionType }">
                    {{ tractionType }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>País</p>
              <div class="dropdown">
                <div class="dropdown-header" @click="toggleDropdown(selectedCarIndex, 'country')">
                  {{ addedCar.country || 'Selecciona un país' }}
                  <span class="arrow">{{ dropdownStates[selectedCarIndex]?.country ? '▲' : '▼' }}</span>
                </div>
                <ul v-show="dropdownStates[selectedCarIndex]?.country" class="dropdown-list">
                  <li v-for="(country, index) in carStore.countries" :key="index"
                    @click="addedCar.country = country; toggleDropdown(selectedCarIndex, 'country')"
                    :class="{ selected: country === addedCar.country }">
                    {{ country }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="edit-item">
              <p>Año fabricación</p>
              <input v-model="addedCar.manufactureYear">
            </div>

            <div class="edit-item">
              <p>Descripción</p>
              <input v-model="addedCar.description">
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            <p> {{ errorMessage }}</p>
          </div>

          <div class="bottom-edit-content">

            <button @click="addCar">Guardar</button>
            <button @click="closeAddCar">Cancelar</button>
          </div>

        </div>
      </div>

      <PaginationCars></PaginationCars>
    </main>
  </body>
</template>


<script setup>
import { useCarStore } from '../stores/carStore';
import { onMounted, ref, reactive } from 'vue';
import Header from '../components/Header.vue'
import PaginationCars from '../components/PaginationCars.vue'
import MainSearchBar from '../components/MainSearchBar.vue'

const carStore = useCarStore();

const showDeleteCar = ref(false)
const showEditCar = ref(false)
const showAddCar = ref(false)

const selectedCarIndex = ref(null)
const dropdownStates = reactive({})

const errorMessage = ref('')

const editedCar = reactive({
  linkImage: '',
  brand: '',
  model: '',
  category: '',
  maximumSpeed: '',
  acceleration: '',
  startingPrice: '',
  fuelType: '',
  motorType: '',
  tractionType: '',
  country: '',
  manufactureYear: '',
  description: ''
});

const addedCar = reactive({
  linkImage: '',
  brand: '',
  model: '',
  category: '',
  maximumSpeed: '',
  acceleration: '',
  startingPrice: '',
  fuelType: '',
  motorType: '',
  tractionType: '',
  country: '',
  manufactureYear: '',
  description: ''
})


onMounted(async () => {
  await carStore.fetchFilters()
  await carStore.resetUserFilters()
})


const openDeleteCar = (index) => {
  showDeleteCar.value = true
  selectedCarIndex.value = index
}

const closeDeleteCar = () => {
  showDeleteCar.value = false
  selectedCarIndex.value = null
}

const deleteCar = async () => {
  try {
    const carId = carStore.cars[selectedCarIndex.value]._id
    await carStore.deleteCarById(carId)
    carStore.cars = carStore.cars.filter(car => car._id != carId)
    closeDeleteCar()
  } catch (error) {
    console.error(error)
  }
}


const openEditCar = (index) => {
  showEditCar.value = true;
  selectedCarIndex.value = index;

  const selectedCar = carStore.cars[index];
  editedCar.linkImage = selectedCar.linkImage;
  editedCar.brand = selectedCar.brand;
  editedCar.model = selectedCar.model;
  editedCar.category = selectedCar.category;
  editedCar.maximumSpeed = selectedCar.maximumSpeed;
  editedCar.acceleration = selectedCar.acceleration;
  editedCar.startingPrice = selectedCar.startingPrice;
  editedCar.fuelType = selectedCar.fuelType;
  editedCar.motorType = selectedCar.motorType;
  editedCar.tractionType = selectedCar.tractionType;
  editedCar.country = selectedCar.country;
  editedCar.manufactureYear = selectedCar.manufactureYear;
  editedCar.description = selectedCar.description;
};


const closeEditCar = () => {
  showEditCar.value = false
  selectedCarIndex.value = null
  errorMessage.value = ''
}

const editCar = async () => {
  const carId = carStore.cars[selectedCarIndex.value]._id

  // Mapeo de etiquetas legibles para los campos
  const fieldLabels = {
    linkImage: 'Link de la imagen',
    brand: 'Marca',
    model: 'Modelo',
    category: 'Categoría',
    maximumSpeed: 'Velocidad máxima',
    acceleration: 'Aceleración',
    startingPrice: 'Precio de salida',
    fuelType: 'Tipo de combustible',
    motorType: 'Tipo de motor',
    tractionType: 'Tipo de tracción',
    country: 'País',
    manufactureYear: 'Año de fabricación',
    description: 'Descripción'
  };

  // Comprobar que no hay ningún campo vacío
  for (const key in editedCar) {
    if (!editedCar[key]) {
      errorMessage.value = `El campo "${fieldLabels[key]}" no puede estar vacío.`;
      return;
    }
  }

  // Comprobar que esos parámetros son números
  const numericFields = ['startingPrice', 'maximumSpeed', 'acceleration', 'manufactureYear'];

  for (const field of numericFields) {
    if (isNaN(Number(editedCar[field]))) {
      errorMessage.value = `El campo "${fieldLabels[field]}" debe ser un número válido.`;
      return;
    }
  }

  const body = {
    linkImage: editedCar.linkImage,
    brand: editedCar.brand,
    model: editedCar.model,
    category: editedCar.category,
    maximumSpeed: editedCar.maximumSpeed,
    acceleration: editedCar.acceleration,
    startingPrice: editedCar.startingPrice,
    fuelType: editedCar.fuelType,
    motorType: editedCar.motorType,
    tractionType: editedCar.tractionType,
    country: editedCar.country,
    manufactureYear: editedCar.manufactureYear,
    description: editedCar.description
  }


  try {

    await carStore.editCarById(carId, body)

    carStore.cars[selectedCarIndex.value] = {
      ...carStore.cars[selectedCarIndex.value],
      ...body,
    };

    closeEditCar()

  } catch (error) {
    console.error(error)
  }
}

const openAddCar = () => {
  showAddCar.value = true
}

const closeAddCar = () => {
  showAddCar.value = false
  errorMessage.value = ''
  for (const key in addedCar) {
    addedCar[key] = '';
  }
}

const addCar = async () => {

  const fieldLabels = {
    linkImage: 'Link de la imagen',
    brand: 'Marca',
    model: 'Modelo',
    category: 'Categoría',
    maximumSpeed: 'Velocidad máxima',
    acceleration: 'Aceleración',
    startingPrice: 'Precio de salida',
    fuelType: 'Tipo de combustible',
    motorType: 'Tipo de motor',
    tractionType: 'Tipo de tracción',
    country: 'País',
    manufactureYear: 'Año de fabricación',
    description: 'Descripción'
  }

  // Comprobar que no hay ningún campo vacío
  for (const key in addedCar) {
    if (!addedCar[key]) {
      errorMessage.value = `El campo "${fieldLabels[key]}" no puede estar vacío.`;
      return;
    }
  }

  // Comprobar que esos parámetros son números
  const numericFields = ['startingPrice', 'maximumSpeed', 'acceleration', 'manufactureYear']

  for (const field of numericFields) {
    if (isNaN(Number(addedCar[field]))) {
      errorMessage.value = `El campo "${fieldLabels[field]}" debe ser un número válido.`
      return
    }
  }

  try {

    const newCar = await carStore.addCar(addedCar)
    carStore.cars.unshift(newCar)

    closeAddCar()
  } catch (error) {

  }

}

const toggleDropdown = (index, dropdownType) => {
  if (!dropdownStates[index]) {
    dropdownStates[index] = {}
  }
  dropdownStates[index][dropdownType] = !dropdownStates[index][dropdownType];
};

</script>

<style scoped>
* {
  box-sizing: border-box;
}

main {
  width: 100%;
  background-color: var(--color-primary1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-bottom: 100px;
}

main h1 {
  margin-top: 150px;
}

.all-container {
  width: 90%;
  min-height: 500px;
  height: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary2);
  border-radius: 12px;
  border: 2px solid var(--color-primary3);
}

.all-container-top {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  background-color: var(--color-primary1);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  border: 1px solid var(--color-terciary1);
  padding: 15px;
}

.all-container-top button {
  min-width: 150px;
  width: auto;
  max-width: 300px;
  padding: 8px 5px;
  background-color: var(--color-secondary1);
  color: white;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  transition: 0.2s ease;
  cursor: pointer;
}

.all-container-top button:hover {
  transform: scale(1.05);
}

.all-cars {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.all-cars-inner {
  display: table;
  min-width: 1200px;
}

.all-cars::-webkit-scrollbar {
  height: 8px;
}

.all-cars::-webkit-scrollbar-track {
  background: var(--color-primary2);
}

.all-cars::-webkit-scrollbar-thumb {
  background: var(--color-secondary1);
  border-radius: 4px;
}

.car-parameters {
  display: grid;
  grid-template-columns: 80px 80px 150px 130px 130px 130px 130px 130px 130px 130px 130px 130px 130px 130px 200px;
  align-items: center;
  text-align: center;
  font-weight: bold;
  background-color: var(--color-primary3);
  padding: 10px 0;
  border-bottom: 1px solid var(--color-terciary1);
}

.car-container {
  display: grid;
  grid-template-columns: 80px 80px 150px 130px 130px 130px 130px 130px 130px 130px 130px 130px 130px 130px 200px;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid var(--color-terciary1);
  padding: 10px 0;
}

.car-container img {
  width: 100px;
  height: 80px;
  object-fit: cover;
  margin: 0 auto;
}

.car-container .desc {
  width: 200px;
  height: 100px;
  overflow-y: auto;
}

.car-container .icons {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: 0.2s ease;
}

.car-container .icons:hover {
  transform: scale(1.05);
}

.overlay-background {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  min-width: 350px;
  width: auto;
  max-width: 95%;
  min-height: 150px;
  height: auto;
  max-height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  gap: 10px;
  margin-top: 100px;
  box-shadow: var(--shadow-primary1);
  background-color: var(--color-primary2);
  padding: 15px;
}

.bottom-edit-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding-bottom: 20px;
}

.bottom-edit-content button {
  min-width: 100px;
  width: auto;
  padding: 10px 20px;
  background-color: var(--color-secondary1);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  transition: 0.2s ease;
  cursor: pointer;
}

.bottom-edit-content button:hover {
  transform: scale(1.05);
}

.edit-container {
  width: 100%;
  height: 100%;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.edit-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 300px;
  gap: 10px;
}

.edit-item p {
  font-weight: bold;
  min-width: 250px;
}

.edit-item input {
  text-align: left;
  height: 45px;
  width: 200px;
  color: var(--color-terciary1);
  background: var(--color-primary1);
  border: none;
  padding: 10px 12px;
}

.edit-item-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-item-img img {
  width: 100px;
  height: 70px;
  object-fit: cover;
}

.dropdown {
  height: auto;
  position: relative;
  background: var(--color-primary1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
}

.dropdown-header {
  width: 200px;
  height: 45px;
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header:hover {
  background: var(--color-primary2);
}

.dropdown-list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-primary1);
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 2;
}

.dropdown-list li {
  padding: 10px 12px;
  cursor: pointer;
}

.dropdown-list li:hover {
  background: var(--color-primary2);
}

.dropdown-list li.selected {
  font-weight: bold;
  background: var(--color-secondary1);
  color: white;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}


@media (max-width: 768px) {

  .edit-item * {
    font-size: 12px;
  }

  .edit-item {
    width: 150px;

  }

  .edit-item input {
    width: 100px;
  }

  .edit-item-img img {
    width: 40px;
    height: 40px;
  }

  .dropdown-header {
    width: 150px;
  }

}
</style>