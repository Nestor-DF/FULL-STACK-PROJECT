import { defineStore } from 'pinia';
import axios from 'axios';

export const useListStore = defineStore('listStore', {
  state: () => ({
    publicLists: [], // Todas las listas públicas
    latestLists: [],  // listas mas recientes
    topRatedLists: [], // Listas mejor valoradas
    mostCommentedLists: [], // Listas con más comentarios
    randomLists: [], // Listas aleatorias
    carImagesList: [], // Imágenes de los coches
  }),

  actions: {
    // Obtener todas las listas públicas
    async fetchPublicLists() {
      try {
        const response = await axios.get('http://localhost:5000/api/carList/public');
        this.publicLists = response.data; // Guardar las listas públicas
      } catch (error) {
        console.error('Error fetching public lists:', error);
      }
    },

    // Obtener todas las listas públicas
    async fetchLatestLists() {
      try {
        const response = await axios.get('http://localhost:5000/api/carList/latest');
        this.latestLists = response.data; // Guardar las listas públicas
      } catch (error) {
        console.error('Error fetching latest lists:', error);
      }
    },

    // Obtener las listas mejor valoradas
    async fetchTopRatedLists() {
      try {
        const response = await axios.get('http://localhost:5000/api/carList/top-rated');
        this.topRatedLists = response.data; // Guardar las listas mejor valoradas
      } catch (error) {
        console.error('Error fetching top-rated lists:', error);
      }
    },

    // Obtener las listas con más comentarios
    async fetchMostCommentedLists() {
      try {
        const response = await axios.get('http://localhost:5000/api/carList/most-commented');
        this.mostCommentedLists = response.data; // Guardar las listas más comentadas
      } catch (error) {
        console.error('Error fetching most-commented lists:', error);
      }
    },

    // Obtener listas aleatorias
    async fetchRandomLists() {
      try {
        const response = await axios.get('http://localhost:5000/api/carList/random');
        this.randomLists = response.data; // Guardar listas aleatorias
      } catch (error) {
        console.error('Error fetching random lists:', error);
      }
    },

    // Añadir un comentario a una lista
    async addCommentToList(listId, comment) {
      try {
        const response = await axios.post(`http://localhost:5000/api/carList/${listId}/comment`, {
          comment,
        });
        console.log('Comment added successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding comment to the list:', error);
        throw error;
      }
    },

    // Borra una lista
    async deleteCarListById(listId) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`http://localhost:5000/api/carList/${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

      } catch (error) {
        console.error('Error deleting the list: ', error)
      }
    },

    // Modificar una lista
    async modifyCarListById(listName, cars, posted, listId) {
      try {
        const token = localStorage.getItem('token')

        const body = {}
        if (listName) body.listName = listName
        if (cars) body.cars = cars
        if (posted) body.posted = posted

        const response = await axios.patch(
          `http://localhost:5000/api/carList/${listId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error('Error modifyng the list: ', error)
      }

    },

    async createCarList(listName, cars, posted) {
      try {
        const token = localStorage.getItem('token')

        const body = {}
        if (listName) body.listName = listName
        if (cars) body.cars = cars
        if (posted) body.posted = posted

        const response = await axios.post(
          `http://localhost:5000/api/carList`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error('Error creating the list: ', error)
      }
    }

  },
});


