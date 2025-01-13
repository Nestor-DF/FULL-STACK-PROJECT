<template>
  <div>
    <Header />

    <main>
      <div class="title-news">
        <h1>NOTICIAS RECIENTES</h1>
      </div>

      <div v-if="newsStore.isLoading">Cargando noticias...</div>
      <div v-else-if="newsStore.error" class="error">{{ newsStore.error }}</div>
      <div v-else class="news">
        <NewsCard v-for="(article, index) in articles" :key="index" :article="article" />
      </div>

      <PaginationNews />
    </main>

    <Footer />
  </div>
</template>


<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import NewsCard from '../components/NewsCard.vue';
import PaginationNews from '../components/PaginationNews.vue';
import { useNewsStore } from '../stores/newsStore';
import { ref, computed, onMounted } from 'vue';

const newsStore = useNewsStore();
const articles = computed(() => newsStore.articles);

onMounted(async () => {
});
</script>


<style scoped>
main {
  width: 100%;
  background-color: var(--color-primary1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 140px;
}

.title-news {
  margin-top: 140px;
  text-align: center;
  color: var(--color-terciary1);
}

.news {
  display: flex;
  flex-direction: row;
  text-align: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 100px;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}


/* RESPONSIVE */
@media (max-width: 1000px) {
  .news {
    padding: 50px;
  }
}

</style>
