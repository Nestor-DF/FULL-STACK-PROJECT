<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">&#8592;</button>
    <span v-for="page in pages" :key="page" class="page-number" :class="{ active: page === currentPage }"
      @click="goToPage(page)">
      {{ page }}
    </span>
    <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">&#8594;</button>
  </div>
</template>


<script>
import { useNewsStore } from '../stores/newsStore'; // Importar el store
import { ref, computed, onMounted } from 'vue';

export default {
  name: "PaginationNews",
  setup() {
    // Obtener el store de los coches
    const newStore = useNewsStore();

    // Computed properties para currentPage y totalPages
    const currentPage = computed(() => newStore.currentPage);
    const totalPages = computed(() => newStore.totalPages);

    const pages = computed(() => {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1); // Generar las páginas
    });

    // Método para cambiar de página
    const goToPage = async (page) => {
      await newStore.fetchNews({ page: page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Ejecuta la función para cargar coches cuando el componente se monte
    onMounted(async () => {
      // Si no hay noticias ya cargados, carga la primera página de noticias
      if (newStore.articles.length === 0) {
        await goToPage(1); 
      }
    });

    return {
      currentPage,
      totalPages,
      pages,
      goToPage,
    };
  },
};
</script>


<style scoped>
/* Tus estilos de paginación existentes */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.pagination button {
  background-color: var(--color-primary4);
  color: var(--color-terciary1);
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: var(--color-primary3);
  cursor: not-allowed;
}

.pagination .page-number {
  color: var(--color-terciary2);
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.pagination .page-number.active {
  background-color: var(--color-secondary1);
  /* Color para la página actual */
  color: var(--color-primary1);
  font-weight: bold;
}

.pagination .page-number:hover {
  background-color: var(--color-primary3);
}
</style>
