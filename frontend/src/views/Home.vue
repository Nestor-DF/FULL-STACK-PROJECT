<template>

  <body>
    <Header />

    <main>
      <section class="welcome-section">
        <div>
          <h1 class="cars">CARS</h1>
          <h1 class="hub"><span>HUB</span></h1>
          <p>¡Busca tus <span>coches</span> favoritos!</p>
        </div>
      </section>

      <MainSearchBar />

      <section class="list-cars">
        <div class="cars-container">
          <div v-for="(car, index) in carStore.randomCars" :key="index">
            <Car :carBrand="car.brand" :carModel="car.model" :carPrice="car.startingPrice" :carImage="car.linkImage"
              :carID="car._id" />

          </div>
        </div>
        <router-link to="/all-cars" class="button-link">
          Ver más coches
        </router-link>
      </section>
    </main>

    <Footer />
  </body>
</template>



<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import MainSearchBar from '../components/MainSearchBar.vue';
import Car from '../components/Car.vue'
import { useCarStore } from '../stores/carStore';
import { onMounted } from 'vue';

// Creas el store
const carStore = useCarStore();

onMounted(async () => {
  await carStore.fetchRandomCars(6);  // Carga de 6 coches aleatorios
});
</script>



<style scoped>
/** CONTENEDOR GLOBAL */
main {
  width: 100%;
  height: 170%;
  background-color: var(--color-primary1);
  display: flex;
  gap: 70px;
  flex-direction: column;
  align-items: center;
  padding-bottom: 140px;
}



/** TITULO Y SUBTITULO */
.welcome-section {
  height: 500px;
  width: 100%;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.welcome-section h1 {
  color: var(--color-terciary1);
  display: inline-block;
  /* Asegura que estén en la misma línea */
  font-size: 110px;
  opacity: 0;
  /* Inicialmente invisible */
}

.welcome-section h1.cars {
  animation: slideInLeft 2s ease-out forwards;
  /* Animación para "CARS" */
}

.welcome-section h1.hub {
  color: var(--color-secondary1);
  animation: slideInRight 2s ease-out forwards;
  /* Animación para "HUB" con un pequeño retraso */
}

.welcome-section p {
  color: var(--color-terciary1);
  font-size: 30px;
  opacity: 0;
  /* Inicialmente invisible */
  animation: fadeInUp 2s ease-out forwards 1s;
  /* Animación para el subtítulo */
}

.welcome-section p span {
  color: var(--color-secondary1);
}

/* Animación para "CARS" que entra desde la izquierda */
@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
    /* Empieza fuera de la pantalla a la izquierda */
  }

  100% {
    opacity: 1;
    transform: translateX(0);
    /* Se mueve a su posición original */
  }
}

/* Animación para "HUB" que entra desde la derecha */
@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
    /* Empieza fuera de la pantalla a la derecha */
  }

  100% {
    opacity: 1;
    transform: translateX(0);
    /* Se mueve a su posición original */
  }
}

/* Animación para el subtítulo que aparece desde abajo */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
    /* Empieza abajo */
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    /* Se mueve a su posición original */
  }
}



/** LISTA DE COCHES */
.list-cars {
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 35px;
  justify-content: center;
  align-items: center;
}

.cars-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.button-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--color-secondary1);
  color: white;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  text-decoration: none;
  transition: 0.2s ease;
}

.button-link:hover {
  transform: scale(1.05);
}


@media (max-width: 768px) {

  .welcome-section h1 {
    font-size: 80px;
  }

  .welcome-section p {
    font-size: 20px;
  }


}
</style>