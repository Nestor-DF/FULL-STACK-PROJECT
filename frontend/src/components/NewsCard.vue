<template>
  <div class="news-card">
    <!-- Imagen superior con enlace -->
    <a :href="article.url" target="_blank" class="news-image-link">
      <img 
        :src="article.image || '../../public/default-news-image.png'" 
        :alt="article.title" 
        @error="handleImageError"
      />
    </a>

    <!-- Contenido de la noticia -->
    <div class="news-content">
      <!-- Fecha y categoría -->
      <div class="news-meta">
        <span>{{ formatDate(article.publishedAt) }}</span>
        <span>{{ article.category }}</span>
      </div>
      
      <!-- Título -->
      <h2 class="news-title">{{ article.title }}</h2>

      <!-- Botón para desplegar más información -->
      <button class="toggle-button" @click="toggleDetails">
        {{ isExpanded ? 'Ver menos' : 'Ver más' }}
      </button>

      <!-- Desplegable con descripción y fuente -->
      <div v-if="isExpanded" class="news-details">
        <p class="news-description">{{ article.description }}</p>
        <a :href="article.url" target="_blank" class="news-source">
          Fuente: {{ article.source }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsCard",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false, // Estado del desplegable
    };
  },
  methods: {
    toggleDetails() {
      this.isExpanded = !this.isExpanded; // Alternar entre mostrar/ocultar
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    handleImageError(event) {
      event.target.src = '../../public/default-news-image.png'; // Imagen por defecto si no se carga
    }
  },
};
</script>

<style scoped>
/** CONTENEDOR GLOBAL */
.news-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-primary3);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}


/* IMAGEN */
.news-image-link img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}


/* CONTENIDO */
.news-content {
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/** fecha */
.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--color-terciary2);
  margin-bottom: 5px;
}

/** titulo */
.news-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-secondary1);
  margin: 0;
}

/** ver más */
.toggle-button {
  background-color: var(--color-primary2);
  color: var(--color-terciary1);

  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  align-self: center;
}
.toggle-button:hover {
  background-color: var(--color-primary4);
  transform: scale(1.05);
}

/** descripción */
.news-details {
  overflow: hidden;
  max-height: 300px;
  transition: max-height 0.3s ease;
}
.news-description {
  font-size: 1rem;
  color: var(--color-terciary1);
  margin: 10px 0;
}

/** fuente */
.news-source {
  font-size: 0.9rem;
  color: var(--color-secondary1);
  text-decoration: none;
  align-self: flex-start;
  transition: color 0.3s ease;
}
.news-source:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .news-card {
    max-width: 100%;
  }
}
</style>

