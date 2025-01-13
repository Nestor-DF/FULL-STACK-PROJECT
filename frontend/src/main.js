import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import axios from 'axios';

import App from './App.vue';
import router from './router/index';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useAuthStore } from './stores/auth';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.mount('#app');

localStorage.removeItem('cars');  // PARA EVITAR PROBLEMAS AL BORRAR VOLÚMENES Y QUE SE MANTENTA LA INFORMACIÓN
localStorage.removeItem('carFilters')

// Interceptor de Axios para agregar automáticamente el token JWT en los encabezados
// de cada solicitud. Si el token existe en el almacenamiento local, se incluye
// en el encabezado Authorization como "Bearer <token>" para permitir el acceso
// a rutas protegidas que requieran autenticación.
axios.interceptors.request.use((config) => {
  // Se podría hacer con localStorage.getItem('token') pero es mejor usar el store (mirar stores/auth.js)
  const authStore = useAuthStore();  // Accede al store de autenticación
  const token = authStore.token;    // Obtén el token de la store
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});