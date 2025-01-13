<template>

  <body>
    <Header />
    <main>
      <div class="layout-container">
        <!-- Filtros -->
        <div class="list-filters">
          <button @click="setActiveList('topRated')" :class="{ active: activeList === 'topRated' }">
            Mejor Valoradas
          </button>
          <button @click="setActiveList('latestLists')" :class="{ active: activeList === 'latestLists' }">
            Más recientes
          </button>
          <button @click="setActiveList('mostCommented')" :class="{ active: activeList === 'mostCommented' }">
            Más Comentadas
          </button>
          <button @click="setActiveList('random')" :class="{ active: activeList === 'random' }">
            Aleatorias
          </button>
        </div>

        <!-- Contenido principal -->
        <div class="main-content">
          <div class="title">
            <h1>{{ activeListTitle }}</h1>
          </div>

          <section class="list-lists">
            <div v-for="(list, index) in activeLists" :key="index">
              <List :list="list" />
            </div>
          </section>
        </div>
      </div>
    </main>
  </body>
</template>



<script setup>
import Header from '../components/Header.vue';
import List from '../components/List.vue';
import { useListStore } from '../stores/listStore';
import { onMounted, ref, computed } from 'vue';

// Obtiene el store
const listStore = useListStore();

// Estado local para controlar la lista activa
const activeList = ref(null); // Predeterminado: 'topRated'

// Computed para determinar el título dinámico
const activeListTitle = computed(() => {
  switch (activeList.value) {
    case 'topRated':
      return 'LISTAS MEJOR VALORADAS';
    case 'mostCommented':
      return 'LISTAS MÁS COMENTADAS';
    case 'random':
      return 'LISTAS ALEATORIAS';
    case 'latestLists':
      return 'LISTAS PÚBLICAS';
    default:
      return 'LISTAS';
  }
});

// Computed para las listas activas basadas en el tipo seleccionado
const activeLists = computed(() => {
  switch (activeList.value) {
    case 'topRated':
      return listStore.topRatedLists;
    case 'mostCommented':
      return listStore.mostCommentedLists;
    case 'random':
      return listStore.randomLists;
    case 'latestLists':
      return listStore.latestLists;
    default:
      return [];
  }
});

// Método para cambiar la lista activa
const setActiveList = async (listType) => {
  // Evita cambiar el estado si ya estás cargando la misma lista
  if (activeList.value === listType) return;

  activeList.value = null;

  // Llama a la acción correspondiente del store según el tipo de lista
  switch (listType) {
    case 'topRated':
      await listStore.fetchTopRatedLists();
      activeList.value = listType;
      break;
    case 'mostCommented':
      await listStore.fetchMostCommentedLists();
      activeList.value = listType;
      break;
    case 'random':
      await listStore.fetchRandomLists();
      activeList.value = listType;
      break;
    case 'latestLists':
      await listStore.fetchLatestLists();
      activeList.value = listType;
      break;
  }
};


onMounted(async () => {
  await setActiveList('topRated'); // Carga inicial: listas mejor valoradas
});
</script>






<style scoped>
/* Contenedor principal */
main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: var(--color-primary3);
}

/* Layout */
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  /* Fila principal: filtros y contenido */
  align-items: flex-start;
  /* Alinea los hijos al inicio verticalmente */

}


/* FILTROS */
.list-filters {
  width: 15%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 15px;

  background-color: var(--color-primary2);
  position: sticky;
  top: 100px;
  height: calc(100vh - 100px);
  /* Ajusta para tener un scroll interno */
  overflow-y: auto;
  /* Habilita el scroll en caso de contenido largo */
}

.list-filters button {
  width: 100%;
  padding: 10px 20px;
  background-color: var(--color-primary3);
  color: var(--color-terciary1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.list-filters button:hover {
  background-color: var(--color-primary4);
}

.list-filters button.active {
  background-color: var(--color-secondary1);
  color: var(--color-primary1);
  font-weight: bold;
}


/* CONTENIDO PRINCIPAL */
.main-content {
  /* Para ocupar el espacio restante del layout */
  flex: 1;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 50px;
  background-color: var(--color-primary1);
}

.title {
  margin-top: 140px;
  text-align: center;
  color: var(--color-terciary1);
  background-color: var(--color-primary1);
}

.list-lists {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 240px;
  gap: 80px;
  background-color: var(--color-primary1);
}


/** RESPONSIVE */
@media (max-width: 1468px) {
  .layout-container {
    flex-direction: column;
    /* Cambia a columna en pantallas pequeñas */
  }

  .list-filters {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    position: relative;
    /* Desactiva sticky para pantallas pequeñas */
    justify-content: center;
    align-items: center;
    top: 100;
    height: auto;
    padding: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .list-filters button {
    width: 40%;
    font-size: 14px;
  }

}

@media (max-width: 768px) {
  .list-filters button {
    width: 21%;
    font-size: 11px;
  }
}
</style>
