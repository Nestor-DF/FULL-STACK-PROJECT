<template>

  <body>
    <Header />

    <main>
      <!-- El coche está cargando -->
      <p v-if="!car">Cargando detalles del coche...</p>

      <!-- El coche está cargado -->
      <div v-else>
        <div class="top-page">
          <div class="container-img">
            <div class="image">
              <img :src="car.linkImage" :alt="`${car.brand} ${car.model}`" />
            </div>
            <div class="description">
              <h2>DESCRIPCIÓN GENERAL</h2>
              <p> {{ car.description }} </p>
            </div>
          </div>

          <div class="list-section">
            <button @click="toggleShowLists">{{ !showLists ? 'Añadir a lista' : 'Cerrar lista' }}</button>
            <div v-if="showLists">
              <div v-if="userStore.carsList.length != 0" class="dropdown">
                <ul>
                  <li v-for="(list, index) in userStore.carsList" :key="list._id" @click="addToList(index, car._id)">
                    {{ list.listName }}
                  </li>
                </ul>
              </div>
              <div v-if="userStore.carsList.length == 0">
                <p>No hay listas creadas. <router-link to="/userprofile" class="clickable-link">¡Empieza a crear una!</router-link></p>
              </div>
            </div>

            <p v-if="errorMessage" class="error-message"> {{ errorMessage }}</p>
            <p v-if="doneMessage" class="done-message"> {{ doneMessage }}</p>

          </div>

        </div>


        <h1 class="car-title">{{ car.brand }} {{ car.model }}</h1>


        <div class="spec-summary-container">
          <div class="spec-summary-item">
            <span class="spec-summary-value">{{ car.startingPrice }}€</span>
            <span class="spec-summary-type">PRECIO</span>
          </div>
          <div class="spec-summary-item">
            <span class="spec-summary-value">{{ car.maximumSpeed }} km/h</span>
            <span class="spec-summary-type">VELOCIDAD</span>
          </div>
          <div class="spec-summary-item">
            <span class="spec-summary-value">{{ car.country }}</span>
            <span class="spec-summary-type">PAÍS</span>
          </div>
        </div>


        <div class="specifications-container">
          <h2>ESPECIFICACIONES TÉCNICAS</h2>
          <div class="specifications-table">
            <div class="spec-row">
              <span class="spec-title">MARCA:</span>
              <span class="spec-value">{{ car.brand }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">MODELO:</span>
              <span class="spec-value">{{ car.model }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">CATEGORÍA:</span>
              <span class="spec-value">{{ car.category }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">VELOCIDAD MÁXIMA:</span>
              <span class="spec-value">{{ car.maximumSpeed }}km/h</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">ACELERACIÓN(0-100km/h):</span>
              <span class="spec-value">{{ car.acceleration }}seg</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">PRECIO DE SALIDA:</span>
              <span class="spec-value">{{ car.startingPrice }}€</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">TIPO DE COMBUSTIBLE:</span>
              <span class="spec-value">{{ car.fuelType }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">MOTOR:</span>
              <span class="spec-value">{{ car.motorType }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">TRACCIÓN:</span>
              <span class="spec-value">{{ car.tractionType }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">PAÍS:</span>
              <span class="spec-value">{{ car.country }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-title">AÑO DE FABRICACIÓN:</span>
              <span class="spec-value">{{ car.manufactureYear }}</span>
            </div>

          </div>
        </div>

      </div>
    </main>

    <Footer />

  </body>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Para obtener el parámetro 'id' de la URL
import { useCarStore } from '../stores/carStore'; // Importamos el store de coches
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/auth';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { useListStore } from '../stores/listStore';

// Obtiene el parámetro 'id' de la ruta
const route = useRoute();
const carId = route.params.id;

const router = useRouter()

const doneMessage = ref('')
const doneMessageTimeout = ref(null)
const errorMessage = ref('')
const errorTimeout = ref(null)

const userStore = useUserStore()
const showLists = ref(false)

const carListStore = useListStore()

const authStore = useAuthStore();

// Accede al store de coches
const carStore = useCarStore();

const car = ref(null); // Estado reactivo para almacenar los detalles del coche

// Función para obtener los detalles del coche utilizando el store
const fetchCarDetails = async () => {
  await carStore.fetchCarsById(carId);  // Llamamos al método fetchCarsById del store
  car.value = carStore.carID;  // Asignamos los detalles del coche al estado reactivo
};

// Llama a la función cuando el componente se monta
onMounted(async () => {
  fetchCarDetails();
  if (authStore.isAuthenticated) {
    await userStore.fetchLoggedUser()
  }
});


const toggleShowLists = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return
  }
  showLists.value = !showLists.value;
};

const addToList = async (index, carId) => {
  try {
    const actualList = userStore.carsList[index]
    if (actualList.cars.includes(carId)) {
      errorMessage.value = '¡Ya está en la lista!'
      errorTimeout.value = setTimeout(() => {
        errorMessage.value = '';
      }, 1500);
      return
    }
    actualList.cars.push(carId)

    await carListStore.modifyCarListById(actualList.listName, actualList.cars, actualList.posted, actualList._id)
    userStore.carsList[index] = actualList

    doneMessage.value = '¡Se ha añadido correctamente!'
    doneMessageTimeout.value = setTimeout(() => {
      doneMessage.value = '';
    }, 1500);

  } catch (error) {
    console.error('Error al añadir coche a la lista:', error);
  }
}

</script>




<style scoped>
/** CONTENEDOR GLOBAL */
main {
  width: 100%;
  background-color: var(--color-primary1);
  display: flex;
  flex-direction: column;

  padding-bottom: 140px;

}

.top-page {
  width: 100%;
  height: auto;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.list-section {
  width: 100%;
  height: auto;
  max-height: 500px;
  text-align: center;
  position: relative;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list-section button {
  width: 30%;
  padding: 10px 20px;
  background-color: var(--color-secondary1);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  transition: 0.2s ease;
  cursor: pointer;
}

.list-section button:hover {
  transform: scale(1.05);
}

.dropdown {
  width: 400px;
  height: auto;
  background: var(--color-primary1);
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown li:hover {
  background: var(--color-primary2);
}

.clickable-link {
  text-decoration: underline;
  cursor: pointer;
  color: var(--color-secondary1);
  transition: 0.2s ease;
}

.clickable-link:hover {
  color: var(--color-secondary2);
}

/** CONTENEDOR DE LA IMAGEN Y DESCRIPCIÓN */
.container-img {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

}

.image {
  position: relative;
  width: 65%;
  height: 600px;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);
  overflow: hidden;
  opacity: 0;
  /* Inicialmente invisible */
  transform: translateX(-100%);
  /* Empieza a la izquierda */
  animation: imageSlideIn 2s ease-out forwards;
  /* Animación para mover y hacer visible */
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.description {
  max-width: 30%;
  align-items: center;
  justify-content: center;
  text-align: justify;
  margin: auto;
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeIn 2s ease-out forwards 1.5s;
}

.description h2 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 15px;
}

.description p {
  font-size: 1.2em;
  line-height: 1.8;
  word-wrap: break-word;
  /* Rompe palabras largas si es necesario */
}

/** animaciones */
@keyframes imageSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-100%);
    /* Empieza fuera de la pantalla a la izquierda */
  }

  100% {
    opacity: 1;
    transform: translateX(0);
    /* Termina en su posición original */
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(50px);
    /* Comienza más abajo */
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    /* Termina en su posición original */
  }
}




/**TITULO */
.car-title {
  margin-top: 200px;
  text-align: center;
  color: var(--color-secondary1);
  font-size: 4em;

  padding: 20px;
  text-transform: uppercase;
  /* Mostrarlo todo en mayúsculas */
}



/** DETALLES RESUMIDOS */
.spec-summary-container {
  margin-top: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: var(--color-primary3);

  padding: 100px;
  gap: 100px;
}

.spec-summary-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.spec-summary-value {
  font-size: 3em;
  color: var(--color-terciary1);

}

.spec-summary-type {
  font-size: 1em;
  color: var(--color-terciary2);
  text-transform: uppercase;
}



/** DETALLES TÉCNICOS */
.specifications-container {
  margin: auto;
  margin-top: 100px;

  width: 100%;
  max-width: 677px;
  padding: 50px;
  font-family: Arial, sans-serif;
  color: var(--color-terciary1);
  /* Color principal del texto */
  text-align: center;
}

.specifications-container h2 {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase;
  color: var(--color-terciary1);
}

.specifications-table {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-terciary1);
  padding: 10px 0px;
}

.spec-title {
  text-align: left;
  font-size: 1.2em;

}

.spec-value {
  text-align: right;
  font-size: 1.2em;
  font-weight: 200;
  color: var(--color-terciary2);
}

.error-message {
  color: red;
  font-size: 12px;
}

.done-message {
  color: green;
  font-size: 12px;
}

/** RESPONSIVE */
@media (max-width: 1068px) {

  .container-img {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .image {
    width: 100%;
    height: auto;
    clip-path: none;
  }

  .description {
    max-width: 80%;
  }

  .description h2 {
    font-size: 16px;
  }

  .description p {
    font-size: 14px;

  }


  .car-title {
    font-size: 24px;
  }


  .spec-summary-container {
    margin-top: 50px;
    gap: 30px;
  }


  .spec-summary-value {
    font-size: 18px;

  }

  .spec-summary-image {
    width: 50%;
    height: auto;
  }



  .specifications-container {
    margin-top: 50px;
    width: 80%;
  }

  .specifications-container h2 {
    font-size: 15px;
    margin-bottom: 1cap;
  }

  .specifications-table {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .spec-title {
    font-size: 12px;
  }

  .spec-value {
    font-size: 10px;
  }

  .dropdown {
    max-height: 150px;
    width: 150px;
  }

}
</style>
