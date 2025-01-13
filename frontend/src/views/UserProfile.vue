<script setup>
import Header from '../components/Header.vue'
import UserData from '../components/UserData.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore';
import { onMounted, ref, watch } from 'vue'

const route = useRoute()
const userId = ref(route.params.id)

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      userId.value = newId
    }
  }
)

</script>



<template>

  <body>
    <Header />

    <main>

      <UserData :userId="userId" :key="userId" />
    </main>

  </body>
</template>



<style scoped>
/* Asegura que el contenedor principal ocupe todo el ancho y alto disponible */
main {
  height: 100%;
  width: 100%;
  display: block;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  padding-bottom: 150px;
  background-color: var(--color-primary1);
}
</style>