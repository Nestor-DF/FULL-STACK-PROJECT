<script setup>
import Header from '../components/Header.vue'
import LogIn from '../components/LogInForm.vue'
</script>



<template>
  <body>
    <Header />
    <main>
      <LogIn />
    </main>
  </body>
</template>



<style scoped>
main {
  width: 100%;
  background-color: var(--color-primary1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
