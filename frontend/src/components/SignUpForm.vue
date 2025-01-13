<template>
    <div class="signup-container">
        <img src="https://img.freepik.com/fotos-premium/vista-frontal-silueta-oscura-coche-negro-lujo-moderno-aislado-sobre-fondo-negro_698214-3217.jpg"
            alt="Imagen 4">

        <div class="signup-data">
            <h2> Registrarse </h2>

            <form @submit.prevent="signup" class="signup-form">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="email" required placeholder="Introduce tu email" />
                </div>

                <div class="form-group">
                    <label for="username">Nombre de usuario:</label>
                    <input type="text" id="username" v-model="username" required
                        placeholder="Introduce tu nombre de usuario" />
                </div>

                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" v-model="password" required
                        placeholder="Introduce tu contraseña" />
                </div>

                <button type="submit" :disabled="isSubmitting">Registrarse</button>

                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>

        </div>
    </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'  // Importamos la store

// Declaramos las variables reactivas
const email = ref('')
const username = ref('')  // Definimos la variable 'username' para el nombre de usuario
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const router = useRouter()
const authStore = useAuthStore()  // Usamos la store para manejar el estado

const signup = async () => {
    errorMessage.value = ''
    isSubmitting.value = true

    try {
        await authStore.signup(username.value, password.value, email.value)

        router.push('/userprofile')
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isSubmitting.value = false
    }
}
</script>



<style scoped>
/*CONTENEDOR GLOBAL*/
.signup-container {
    width: 60%;
    height: 500px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    background: var(--color-terciary1);
    border-radius: 10px;
}




.signup-container img {
    width: 30%;
    object-fit: cover;
    border-radius: 10px;
}


/*signup*/
.signup-data {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 10%;
    gap: 10px;
    background: var(--color-terciary1);
    border-radius: 8px;
}

h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--color-secondary1);
}

.signup-form {
    display: flex;
    flex-direction: column;
    gap: 0px;
}

.form-group {
    margin-bottom: 15px;
    color: var(--color-secondary1);
    width: 100%;
}

label {
    font-size: 14px;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background-color: var(--color-primary4);
    color: white;
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:disabled {
    background-color: var(--color-secondary2);
}

button:hover:not(:disabled) {
    background-color: var(--color-secondary3);
}

.error-message {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
}


/** RESPONSIVIDAD */
@media (max-width: 1024px) {
    .signup-container {
        width: 90%;
    }
}
</style>
