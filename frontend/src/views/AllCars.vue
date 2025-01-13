<template>

  <body>
    <Header />

    <main>
      <div class="title-cars">
        <h1>COCHES</h1>
      </div>

      <MainSearchBar />

      <section class="list-cars">
        <div v-for="(car, index) in cars" :key="index">
          <Car :carBrand="car.brand" :carModel="car.model" :carPrice="car.startingPrice" :carImage="car.linkImage"
            :carID="car._id" />
        </div>
      </section>

      <PaginationCars />
    </main>

    <Footer />
  </body>
</template>


<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import MainSearchBar from '../components/MainSearchBar.vue';
import Car from '../components/Car.vue';
import PaginationCars from '../components/PaginationCars.vue';
import { useCarStore } from '../stores/carStore';
import { ref, computed, onMounted } from 'vue';

const carStore = useCarStore();
const cars = computed(() => carStore.cars);  // Computed para enlazar los coches del store y los filtros de la store

</script>


<style scoped>
/** CONTENEDOR PRINCIPAL */
main {
  width: 100%;
  background-color: var(--color-primary1);
  display: flex;
  gap: 50px;
  flex-direction: column;
  align-items: center;
  padding-bottom: 140px;
}

.title-cars {
  margin-top: 140px;
  text-align: center;
  color: var(--color-terciary1);
}

.list-cars {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 0px;
}
</style>
