import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',  // Inicializamos con el token de localStorage, si existe
    user: null,
  }),

  actions: {
    async signup(username, password, email) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/signup', {
          username,
          password,
          email
        })
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token)
        // Guardar el token en el estado de la store
        this.token = response.data.token
        // Opcional: Aquí puedes agregar la lógica para obtener la información del usuario
        // this.user = await axios.get('/api/auth/me') // Por ejemplo, si tienes un endpoint para obtener los datos del usuario
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al registrarse')
      }
    },

    async signin(email, password) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/signin', {
          email,
          password,
        })
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token)
        // Guardar el token en el estado de la store
        this.token = response.data.token
        // Opcional: Aquí puedes agregar la lógica para obtener la información del usuario
        // this.user = await axios.get('/api/auth/me') // Por ejemplo, si tienes un endpoint para obtener los datos del usuario
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
      }
    },

    logout() {
      // Limpiar el estado y localStorage cuando el usuario cierra sesión
      localStorage.removeItem('token')
      this.token = ''
      this.user = null
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});

