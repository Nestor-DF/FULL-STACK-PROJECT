<template>
    <div class="list-container">
        <div class="list-header" v-if="list.listName">
            <p class="list-title"> {{ list.listName }} </p>
            <p class="list-date"> {{ formatDate(list.createdAt) }} </p>
        </div>

        <div class="user" v-if="user">
            <img :src="user.avatar.linkImage" :alt="user.avatar.name || 'Imagen de avatar de usuario'"
                @click="goToUserProfile(user._id)" />
            <p @click="goToUserProfile(user._id)">{{ user.username }}</p>

        </div>

        <div class="cars" v-if="cars.length > 0">
            <div class="carousel-image">
                <!-- Indicador dentro de la imagen -->
                <div class="indicator">
                    {{ activeIndex + 1 }} / {{ cars.length }}
                </div>

                <router-link :to="`/car/${cars[activeIndex]._id}`">
                    <img :src="cars[activeIndex].linkImage" :alt="cars[activeIndex].model" />
                </router-link>
            </div>

            <!-- Botones de navegación -->
            <button class="nav-button prev" @click="prevImage" :disabled="activeIndex === 0">
                &lt;
            </button>
            <button class="nav-button next" @click="nextImage" :disabled="activeIndex === cars.length - 1">
                &gt;
            </button>

        </div>

        <p v-else>Cargando coches...</p>


        <div class="ratings-comments-section">
            <!-- Valoraciones -->
            <div class="ratings" v-if="isLiked !== null">
                <!-- Transición para el cambio de íconos -->
                <transition name="like-transition" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                    <div class="ratings-header" v-show="!isLiked" @click="toggleRatings">
                        <img src="../../public/icons/heart_empty_white.png" alt="Ratings Icon" class="ratings-icon" />
                    </div>
                </transition>

                <transition name="like-transition" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                    <div class="ratings-header" v-show="isLiked" @click="toggleRatings">
                        <img src="../../public/icons/heart_full_white.png" alt="Ratings Icon" class="ratings-icon" />
                    </div>
                </transition>

                <p>{{ list.ratings }}</p>
            </div>

            <!-- Commentarios -->
            <div class="comments">
                <div class="comments-header" v-show="!showComments" @click="toggleComments">
                    <img src="../../public/icons/comment2_white.png" alt="Comments Icon" class="comments-icon" />
                </div>
                <div class="comments-header" v-show="showComments" @click="toggleComments">
                    <img src="../../public/icons/comment1_white.png" alt="Comments Icon" class="comments-icon" />
                </div>
                <p> {{ list.comments.length }} </p>
            </div>
        </div>

        <!-- Lista de comentarios desplegable -->
        <div v-show="showComments" class="comments-list">
            <p v-for="comment in list.comments" :key="comment._id" class="comment-item">

                <!-- <img :src="comment.avatar.linkImage" :alt="comment.avatar.linkImage" />-->
                <strong>{{ comment.user }}:</strong> {{ comment.comment }}
            </p>

            <!-- Botón para agregar comentario -->
            <img v-show="!isAddingComment" @click="startAddingComment" src="../../public/icons/agregar.png"
                alt="Agregar comentario" class="add-comment-icon" />

            <!-- Sección para agregar un comentario -->
            <div v-show="isAddingComment" class="add-comment-section">
                <textarea v-model="newComment" placeholder="Escribe tu comentario aquí..."
                    class="comment-textarea"></textarea>
                <span v-show="errorMessage" class="error-message">{{ errorMessage }}</span>
                <div class="add-comment-buttons">
                    <img @click="submitComment" src="../../public/icons/enviar.png" alt="Enviar comentario"
                        class="send-comment-icon" />
                    <img @click="cancelAddingComment" src="../../public/icons/cerrar.png" alt="Cerrar"
                        class="close-comment-icon" />
                </div>
            </div>

        </div>


    </div>
</template>



<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from "../stores/userStore";
import { useCarStore } from '../stores/carStore';
import { useAuthStore } from "../stores/auth";
import { useListStore } from '../stores/listStore';

export default {
    name: 'CarList',
    props: {
        list: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
        };
    },
    methods: {
        // FORMATEAR FECHA
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate(); // Día del mes
            const monthNames = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];
            const month = monthNames[date.getMonth()]; // Nombre del mes
            const year = date.getFullYear(); // Año
            const hours = date.getHours().toString().padStart(2, '0'); // Hora con 2 dígitos
            const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutos con 2 dígitos

            return `${day} de ${month} de ${year} a las ${hours}:${minutes}`;
        },

        // ANIMACIÓN ME GUSTA
        beforeEnter(el) {
            el.style.transform = 'scale(0.7)';  // Más pequeño que antes
            el.style.opacity = 0;
        },

        enter(el, done) {
            // Forzamos un reflow para que la transición se ejecute correctamente
            el.offsetHeight;

            // Transición de aumentar tamaño y opacidad
            el.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
            el.style.transform = 'scale(1)';
            el.style.opacity = 1;
            done();
        },

        // Transición de reducir tamaño y desvanecimiento al salir
        leave(el, done) {
            el.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
            el.style.transform = 'scale(0.4)';
            el.style.opacity = 0;
            done();
        },
    },


    setup(props) {
        const router = useRouter();
        const list = ref(props.list);
        const userStore = useUserStore();
        const authStore = useAuthStore();
        const carStore = useCarStore();
        const listStore = useListStore();
        const user = ref(null);
        const cars = ref([]);
        const activeIndex = ref(0);
        const isLiked = ref(null);
        const showComments = ref(false);
        const isAddingComment = ref(false);
        const newComment = ref('');
        const errorMessage = ref('');


        // Ir al perfil
        const goToUserProfile = (userId) => {
            router.push(`/userprofile/${userId}`)
        }

        // COMENTAR
        const toggleComments = () => {
            showComments.value = !showComments.value;
        };

        const startAddingComment = () => {
            isAddingComment.value = true;
        };

        const cancelAddingComment = () => {
            isAddingComment.value = false;
            newComment.value = '';
        };

        const submitComment = async () => {
            // comprobar que este autenticado
            if (!authStore.isAuthenticated) {
                await router.push('/login');
                return;
            }

            if (!newComment.value.trim()) {
                errorMessage.value = "El comentario no puede estar vacío.";
                setTimeout(() => {
                    errorMessage.value = ''; // Ocultar el mensaje después de 3 segundos
                }, 3000);
                return;
            }

            try {
                const listId = props.list._id;
                await listStore.addCommentToList(listId, newComment.value);
                props.list.comments.push({ user: userStore.username, comment: newComment.value });  // Actualizar comentarios localmente

                isAddingComment.value = false;
                newComment.value = '';

            } catch (error) {
                console.error("Error al enviar el comentario:", error);
                errorMessage.value = "No se pudo enviar el comentario. Inténtalo de nuevo más tarde.";
                setTimeout(() => {
                    errorMessage.value = '';
                }, 3000);
            }
        };


        // DAR ME GUSTA/NO ME GUSTA
        const toggleRatings = async () => {
            try {
                // comprobar que este autenticado
                if (!authStore.isAuthenticated) {
                    await router.push('/login');
                    return; // Salimos si no está autenticado
                }

                if (isLiked.value) {
                    await dislike();
                    props.list.ratings -= 1;
                } else {
                    await like();
                    props.list.ratings += 1;
                }

                isLiked.value = !isLiked.value;

            } catch (error) {
                console.error("Error al alternar me gusta/no me gusta:", error);
            }
        };


        // Coger las ID de los coches
        const fetchCarsList = async () => {
            if (props.list.cars && props.list.cars.length > 0) {
                for (let i = 0; i < props.list.cars.length; i++) {
                    try {
                        await carStore.fetchCarsById(props.list.cars[i]);
                        if (carStore.carID && carStore.carID._id && carStore.carID.linkImage) {
                            cars.value[i] = carStore.carID;
                        } else {
                            console.error(`Datos inválidos para el coche con ID ${props.list.cars[i]}`);
                        }
                    } catch (error) {
                        console.error(`Error al obtener coche con ID ${props.list.cars[i]}:`, error);
                    }
                }
            } else {
                console.error("La lista de coches está vacía o indefinida.");
            }
        };

        // Coger el usuario
        const fetchUser = async () => {
            try {
                await userStore.fetchUsersById(props.list.user);
                if (userStore.userID) {
                    user.value = userStore.userID;
                } else {
                    console.error("No se encontró ningún usuario con el ID proporcionado.");
                }
            } catch (error) {
                console.error(`Error al obtener usuario con ID ${props.list.user}:`, error);
            }
        };

        // Gustar lista
        const likedList = async () => {
            if (authStore.isAuthenticated) {
                try {
                    await userStore.userListLiked(props.list._id);
                    isLiked.value = userStore.listLiked;
                } catch (error) {
                    console.error(`Error al obtener si le gusta la lista con ID ${props.list._id}:`, error);
                }
            } else {
                isLiked.value = false;
            }

        };
        const like = async () => {
            try {
                await userStore.like(props.list._id);
            } catch (error) {
                console.error("Error al marcar como 'me gusta':", error);
            }
        };
        const dislike = async () => {
            try {
                await userStore.disLike(props.list._id);
            } catch (error) {
                console.error("Error al desmarcar como 'me gusta':", error);
            }
        };


        // Para movimiento de imagenes
        const nextImage = () => {
            if (activeIndex.value < cars.value.length - 1) {
                activeIndex.value++;
            }
        };
        const prevImage = () => {
            if (activeIndex.value > 0) {
                activeIndex.value--;
            }
        };

        onMounted(async () => {
            await fetchCarsList();
            await fetchUser();
            await likedList();
        });


        return {
            list,
            userStore,
            user,
            cars,

            goToUserProfile,

            submitComment,
            startAddingComment,
            cancelAddingComment,
            toggleComments,
            isAddingComment,
            newComment,
            showComments,
            errorMessage,

            toggleRatings,
            like,
            dislike,
            isLiked,

            activeIndex,
            nextImage,
            prevImage,
        };
    },
};
</script>




<style scoped>
/*CONTENEDOR GLOBAL*/
.list-container {
    display: flex;
    flex-direction: column;
    gap: 10px;

    width: 100%;
    height: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    max-width: 60vw;
    min-width: 60vw;
}


/** TITULO */
.list-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.list-title {
    font-size: 28px;
    color: var(--color-terciary1);
    letter-spacing: 2px;
}

.list-date {
    font-size: 16px;
    color: var(--color-terciary2);
    opacity: 0.8;
    font-style: italic;
}


/* USUARIO */
.user {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    color: var(--color-terciary1);
}

.user img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--color-terciary1);
    object-fit: cover;
    cursor: pointer;
}

.user p {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    cursor: pointer;
}


/* COCHES */
.cars {
    width: 100%;
    height: 100%;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.carousel-image {
    width: 45vw;
    height: 30vw;
    overflow: hidden;
}

.carousel-image img {
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.indicator {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: var(--color-primary3);
    color: var(--color-terciary1);

    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;

    z-index: 2;
    /* Asegura que esté encima de la imagen */
}

.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--color-primary3);

    color: var(--color-terciary1);
    border: none;
    border-radius: 50%;

    width: 50px;
    height: 50px;

    font-size: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
}

.nav-button.prev {
    left: 3%;
}

.nav-button.next {
    right: 3%;
}

.nav-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}



/** SECCIÓN DE ABAJO */
.ratings-comments-section {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: row;

    gap: 20px;
}

.ratings-comments-section p {
    font-size: 18px;
    color: var(--color-terciary1);

    padding-left: 8px;
}

/* RATINGS */
.ratings {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.ratings-header {
    display: flex;
    gap: 10px;
    align-items: center;
}

.ratings-icon {
    width: 35px;
    height: 35px;
    object-fit: contain;
    transition: transform 0.7s ease, opacity 0.7s ease;
    /* Transición más lenta */
}

/* Las transiciones de los íconos de "me gusta" */
.like-transition-enter-active,
.like-transition-leave-active {
    transition: transform 0.7s ease, opacity 0.7s ease;
    /* Transición más lenta */
}

.like-transition-enter,
.like-transition-leave-to {
    /* Estado inicial antes de la animación */
    transform: scale(0.7);
    /* Más pequeño */
    opacity: 0;
}

.like-transition-enter-to,
.like-transition-leave {
    /* Estado final después de la animación */
    transform: scale(1);
    /* Más grande durante la transición */
    opacity: 1;
}




/* COMMENTS */
.comments {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

}

.comments-header {
    display: flex;
    gap: 10px;
    cursor: pointer;
}

.comments-icon {
    width: 25px;
    height: 25px;
    object-fit: contain;
}

.comments-list {
    width: 100%;
    color: var(--color-terciary1);

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.comment-item {
    max-width: 90%;
    line-height: 1.5;
    padding: 10px;
    font-size: 1rem;
    white-space: normal; /* Permite saltos de línea */
    overflow-x: hidden;
    word-wrap: break-word; /* Rompe las palabras largas */
    word-break: break-word; /* Soporte adicional para romper palabras */
    white-space: normal; /* Permite saltos de línea */
    overflow-wrap: break-word;
}

/** Añadir comentario */
.add-comment-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-top: 10px;
    margin-left: 10px;
}

.add-comment-icon:hover {
    transform: scale(1.1);
}

.add-comment-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}


.comment-textarea {
    width: 100%;
    height: 80px;
    padding: 5px;
    font-size: 1rem;

    color: var(--color-terciary1);
    border: 1px solid var(--color-primary2);
    background-color: var(--color-primary2);
    resize: none;
}

.comment-textarea:focus {
    border: 1px solid var(--color-primary3);
    box-shadow: none;
    outline: none;
}

.comment-textarea::placeholder {
    color: var(--color-terciary2);
    opacity: 1;
}


.add-comment-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
    gap: 20px;
}

.send-comment-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
}

.close-comment-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

/* Efecto hover */
.send-comment-icon:hover,
.close-comment-icon:hover {
    transform: scale(1.1);
}


.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    display: block;
    animation: fadeIn 0.3s ease;
    /* Efecto de entrada */
}

/* Animación para un efecto más atractivo */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}




/** RESPONSIVE */
@media (max-width: 868px) {
    .list-container {
        max-width: 80vw;
        min-width: 80vw;
    }

    .list-header {
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }

    .list-title {
        font-size: 28px;
    }

    .list-date {
        font-size: 18px;
    }

    .carousel-image {
        width: 80vw;
        height: 65vw;
        overflow: hidden;
    }

    .indicator {
        width: 35px;
        height: 20px;
        padding: 1px;
        text-align: center;
        font-size: 12px;
    }

    .nav-button {
        width: 30px;
        height: 30px;
        font-size: 20px;
    }

    .ratings-icon {
        width: 30px;
        height: 30px;
    }

    .comments-icon {
        width: 20px;
        height: 20px;
    }

    .add-comment-section {
        max-width: 90vw;
    }
}
</style>
