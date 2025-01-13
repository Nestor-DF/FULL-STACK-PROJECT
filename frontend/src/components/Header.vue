<template>
  <header>
    <div class="logo">
      <router-link to="/">
        <img src="../../public/carshub_logo.png" alt="Logo de Carshub">
      </router-link>
    </div>

    <nav>
      <ul class="center-links">
        <router-link to="/" class="custom-link" active-class="active-link">
          INICIO
        </router-link>
        <router-link to="/all-cars" class="custom-link" active-class="active-link">
          COCHES
        </router-link>
        <router-link to="/publiccarlists" class="custom-link" active-class="active-link">
          LISTAS PÚBLICAS
        </router-link>
        <router-link to="/news" class="custom-link" active-class="active-link">
          NOTICIAS
        </router-link>
        <router-link to="/about-us" class="custom-link" active-class="active-link">
          ABOUT US
        </router-link>
        <router-link v-if="isAdmin" to="/admin" class="custom-link" active-class="active-link">
          ADMIN
        </router-link>
      </ul>
    </nav>

    <!--Usuario logeado-->
    <nav v-if="authStore.isAuthenticated" class="user-data">
      <button @click="logout" class="logout custom-link">CERRAR SESIÓN</button>

      <router-link to="/userprofile" class="user-img">
        <img v-if="userStore.userimg" :src="userStore.userimg" :alt="userStore.username" />
      </router-link>

    </nav>

    <!--Usuario no logeado-->
    <nav v-else class="user-data">
      <router-link to="/login" class="login custom-link">
        INICIAR SESIÓN
      </router-link>

      <router-link to="/signup" class="signup custom-link2">
        REGISTRARSE
      </router-link>

    </nav>

  </header>
</template>



<script>
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { onMounted, ref } from "vue";


export default {
  name: 'Header', // Nombre del componente

  setup() {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const isAdmin = ref(false)

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await userStore.fetchLoggedUser();
        checkAdmin()
      }
    });

    // Función para cerrar sesión
    const logout = () => {
      authStore.logout();
      router.push('/'); // Redirigir a la página de inicio
    };

    const checkAdmin = () => {
      isAdmin.value = userStore.role === 'admin'
    }


    return {
      userStore,
      authStore,
      logout,
      isAdmin
    };
  },
};
</script>



<style scoped>
/** HEADER */
header {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary3);

  gap: 5px;
  position: fixed;
  z-index: 99;

}

header * {
  color: var(--color-terciary1);
  font-size: 18px;
}


/** LOGO */
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2%;
}

.logo img {
  height: 100px;
  background-color: #181818;
  border-radius: 50%;
}


/** LINKS CENTRALES */
nav {
  display: flex;
}

.center-links {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  gap: 60px;
  padding: 10px;
}


/** LINKS DERECHOS */
.user-data {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 20px;
  margin-right: 20px;
}

.login {
  justify-content: center;
  color: var(--color-terciary1);
}

.signup {
  justify-content: center;

  color: var(--color-terciary1);
  background-color: var(--color-secondary1);
  padding: 10px;
  border-radius: 10px;

}

.signup:hover {
  background-color: var(--color-secondary2);
}

.logout {
  justify-content: center;
  color: var(--color-terciary1);

  /* Eliminar estilos de botón */
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  cursor: pointer;
}

.logout:hover {
  color: var(--color-secondary1);
}

.user-img {
  display: flex;
  align-items: center;
  justify-content: center;

}

.user-data img {
  height: 55px;
  width: 55px;

  border: var(--border-terciary1);
  border-radius: 50%;
  transition: border-color 0.3s ease;
}

.user-data img:hover {
  border-color: var(--color-secondary1);
}


/** PARA TODOS LOS LINKS */
.custom-link {
  font-weight: bold;
  text-decoration: none;
  position: relative;
  color: inherit;
  padding: 5px 0;
  transition: all 0.5s ease;
}

.custom-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;

  height: 2px;
  background-color: var(--color-secondary1);
  transition: width 0.3s ease;
}

.custom-link:hover::after {
  width: 100%;
}

/** segundo tipo de link */
.custom-link2 {
  text-decoration: none;
  transition: 0.3s ease;
  font-weight: bold;
}


/** links activos */
.custom-link.active-link::after {
  width: 100%;
  background-color: var(--color-secondary2);
}



/** RESPONSIVE */
@media (max-width: 1150px) {

  header * {
    font-size: 14px;
  }

  .logo img {
    height: 55px;
  }

  .center-links {
    gap: 14px;
  }

  .user-data {
    gap: 10px;
    flex-direction: column-reverse;
  }

}

@media (max-width: 668px) {

  header * {
    font-size: 10px;
  }

  .user-data {
    gap: 5px;
    margin-right: 5px;
    flex-direction: column-reverse;
  }

  .user-data img {
    height: 35px;
    width: 35px;
  }

  .center-links {
    gap: 12px;
    flex-wrap: wrap;
  }

}
</style>
