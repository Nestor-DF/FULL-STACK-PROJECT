import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';  // Importa el store de autenticación (Pinia)
import Home from '../views/Home.vue';
import AllCars from '../views/AllCars.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import UserProfile from '../views/UserProfile.vue';
import PublicCarLists from '../views/PublicCarLists.vue';
import CarDetail from '../views/CarDetail.vue';
import News from '../views/News.vue';
import AboutUs from '../views/AboutUs.vue';
import Admin from '../views/Admin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Página principal
  },
  {
    path: '/all-cars',
    name: 'AllCars',
    component: AllCars, // Página para mostrar todos los coches
    // meta: { requiresAuth: true }  // Esta ruta requiere autenticación
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // Página de login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp, // Página de SignUp
  },
  {
    path: '/userprofile',
    name: 'UserProfile',
    component: UserProfile, // Página de Perfil de usuario
  },
  {
    path: '/userprofile/:id',
    name: 'UserProfileById',
    component: UserProfile, // Página de Perfil de usuario
    props: true,
  },
  {
    path: '/publiccarlists',
    name: 'PublicCarLists',
    component: PublicCarLists, // Página de listas públicas de coches
  },
  {
    path: '/car/:id', // Ruta dinámica para un coche específico, basado en su ID
    name: 'CarDetail',
    component: CarDetail, // El componente donde mostrarás los detalles del coche
    props: true, // Pasar el parámetro id como prop al componente CarDetail
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: AboutUs, // Página de saber mas de nosotros
  },
  {
    path: '/news',
    name: 'News',
    component: News, 
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  }
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Siempre hace scroll hacia arriba
    return { top: 0 };
  }
});

// Agregar el guard para la autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();  // Accede al estado de autenticación gestionado por Pinia
  const isAuth = !!authStore.token;  // Verifica si el token de autenticación está presente

  if (to.meta.requiresAuth && !isAuth) {
    // Si la ruta requiere autenticación y no hay token, redirige al login
    next('/login');
  } else {
    next();  // Si no, permite la navegación
  }
});

export default router;
