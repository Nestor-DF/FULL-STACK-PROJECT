<script setup>
import Header from '../components/Header.vue'
import SignUpForm from '../components/SignUpForm.vue'
</script>



<template>
  <body>
    <Header />
    <main>
      <SignUpForm />
    </main>
  </body>
</template>



<style scoped>
main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  background-color: var(--color-primary1);
}
</style>
