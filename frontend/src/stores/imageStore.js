import { defineStore } from 'pinia';
import axios from 'axios';

export const useImageStore = defineStore('imageStore', {
  state: () => ({
    images: [], // Aquí se guardarán todas las imágenes de los avatares
    isLoading: false, // Estado de carga
    error: null, // Mensajes de error
  }),
  actions: {
    // Acción para obtener todas las imágenes
    async fetchImages() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get('http://localhost:5000/api/avatar'); // Ruta a la API
        this.images = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener las imágenes.';
        console.error('Error fetching images:', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    // Getter para devolver las imágenes directamente
    avatarList: (state) => state.images.map(image => image.linkImage),
  },
});
