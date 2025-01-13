<template>
	<!-- <h1>Perfil de usuario</h1> -->
	<!-- <div class="container"> -->
	<!-- Mostrar mensaje si está cargando o no se encontró información -->
	<p v-if="userMessage">{{ userMessage }}</p>


	<!-- Mostrar información del usuario si está cargado -->
	<div v-else class="user-container">


		<div class="upper-profile-data">
			<img v-if="!publicProfile" src="../../public/icons/editar.png" alt="editar" class="edit-button"
				@click="openModal">

			<img v-if="!publicProfile" class="user-avatar" :src="userStore.userimg" :alt="userStore.username" />
			<img v-else class="user-avatar" :src="userStore.userID.avatar.linkImage" :alt="userStore.userID.username" />


			<h2 v-if="!publicProfile">{{ userStore.username }}</h2>
			<h2 v-else> {{ userStore.userID.username }}</h2>

			<button v-if="publicProfile" @click="handleFollowClick"> {{ !isProfileFollowed ?
				'Seguir' : 'Dejar de seguir' }}</button>
		</div>

		<div class="profile-data">
			<div class="profile-data1">
				<div class="user-item">
					<p class="title-item">Nombre</p>
					<p v-if="!publicProfile">{{ userStore.name }}</p>
					<p v-else>{{ userStore.userID.name }}</p>
				</div>

				<div v-if="!publicProfile" class="user-item">
					<p class="title-item">Correo</p>
					<p>{{ userStore.email }}</p>
				</div>
			</div>

			<div class="profile-data2">
				<div class="user-item">
					<p class="title-item">Listas favoritas</p>
					<p v-if="!publicProfile">{{ userStore.likedLists.length }}</p>
					<p v-else>{{ userStore.userID.likedLists.length }}</p>
				</div>

				<div class="user-item" :class="{ 'user-item-interactive': !publicProfile }" @click="openShowFollower">
					<p class="title-item">Seguidores</p>
					<p v-if="!publicProfile">{{ userStore.followers.length }}</p>
					<p v-else>{{ userStore.userID.followers.length }}</p>
				</div>

				<div class="user-item" :class="{ 'user-item-interactive': !publicProfile }" @click="openShowFollowing">
					<p class="title-item">Seguidos</p>
					<p v-if="!publicProfile">{{ userStore.following.length }}</p>
					<p v-else>{{ userStore.userID.following.length }}</p>
				</div>
			</div>


		</div>

	</div>

	<div v-if="showFollower && !publicProfile">
		<div class="layout-background-fw">
			<div class="layout-fw ">
				<h3>Seguidores</h3>
				<div class="all-user-fw">
					<div v-for="(followerUser, index) in userStore.followers" :key="index" class="user-fw"
						@click="goToUserProfile(followerUser._id)">
						<img v-if="followerUser?.avatar" :src="getUserAvatar(followerUser.avatar)" :alt="followerUser.username"
							class="">
						<p>{{ followerUser.username }}</p>
					</div>
				</div>
				<button @click="closeShowFollower">Cerrar</button>
			</div>
		</div>
	</div>

	<div v-if="showFollowing && !publicProfile">
		<div class="layout-background-fw">
			<div class="layout-fw ">
				<h3>Seguidos</h3>
				<div class="all-user-fw">
					<div v-for="(followingUser, index) in userStore.following" :key="index" class="user-fw"
						@click="goToUserProfile(followingUser._id)">
						<img v-if="followingUser?.avatar" :src="getUserAvatar(followingUser.avatar)" :alt="followingUser.username"
							class="">
						<p>{{ followingUser.username }}</p>
					</div>
				</div>
				<button @click="closeShowFollowing">Cerrar</button>
			</div>
		</div>
	</div>

	<div v-if="showModal" class="edit-overlay">
		<div class="edit-content">
			<div class="title-edit">
				<h2>Editar datos</h2>
			</div>

			<div class="profile-edit">
				<h3>Cambiar foto</h3>
				<img v-if="userData.userimg" class="user-avatar" :src="userData.userimg" :alt="userData.username"
					@click="openEditAvatar" />
				<div v-if="showEditAvatar">
					<div class="edit-avatar-overlay">

						<div class="avatar-container">
							<img v-for="(image, index) in imageStore.images" :key="index" :src="image.linkImage" :alt="image.name"
								@click="selectedAvatar(image)" class="image-container">
						</div>
						<div class="bottom-edit-content">
							<button @click="closeEditAvatar">Cancelar</button>
						</div>
					</div>
				</div>
			</div>

			<form @submit.prevent="saveChanges">
				<div class="profile-data-edit">

					<div class="input-form-item">
						<label for="name">Nombre:</label>
						<input type="text" id="name" v-model="userData.name">
					</div>

					<div class="input-form-item">
						<label for="email">Correo:</label>
						<input type="text" id="email" v-model="userData.email" @blur="validateEmail">
						<span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>

					</div>
				</div>

			</form>
			<div class="bottom-edit-content">
				<button @click="saveChanges">Guardar</button>
				<button @click="closeModal">Cancelar</button>
			</div>

		</div>
	</div>

	<div class="section-list">
		<h2 v-if="!publicProfile">Mis listas</h2>
		<div v-if="!publicProfile" class="section-list-my-cars">
			<div v-if="userStore.carsList.length === 0">
				<p> No tienes ninguna lista creada. ¡Empieza creando una!</p>
			</div>

			<div v-for="(list, index) in userStore.carsList" :key="index">
				<p> {{ list.listName }}</p>
				<div class="my-list">
					<img v-if="carStore.carsByList[index] && carStore.carsByList[index][0]" :src="carStore.carsByList[index][0]"
						alt="first image of the list">

					<div class="icon-overlay">
						<img src="../../public/icons/editar.png" alt="editar" @click="openEditCarList(index)">
						<img src="../../public/icons/borrar.png" alt="borrar" @click="openDeleteCarList(index)">
					</div>
				</div>

			</div>

			<div v-if="showDeleteCarList">
				<div class="edit-carlist-overlay-background">
					<div class="edit-carlist-overlay">
						<p>¿Estás seguro?</p>
						<div class="bottom-edit-content">
							<button @click="deleteCarList">Eliminar</button>
							<button @click="closeDeleteCarList">Cancelar</button>
						</div>
					</div>
				</div>
			</div>


			<div v-if="showEditCarList || showAddCarList">
				<div class="edit-carlist-overlay-background">
					<div class="edit-carlist-overlay">
						<div class="edit-carlist-overlay-top">
							<p>¡Añade los coches que quieras!</p>
							<MainSearchBar></MainSearchBar>

							<button v-if="listData[selectedListIndex].posted" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
								@click="editPostedFalse" :style="{
									backgroundColor: isHoveringButton ? 'red' : 'green'
								}">{{ isHoveringButton ? 'Despublicar' : 'Publicado' }}</button>
							<button v-else @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @click="editPostedTrue" :style="{
								backgroundColor: isHoveringButton ? 'green' : 'red'
							}">{{ isHoveringButton ? 'Publicar' : 'No público' }}</button>
						</div>

						<div class="all-cars-add">
							<div v-for="(car, index) in carStore.cars" class="edit-car-overlay">
								<img :src="car.linkImage" alt="car.brand">
								<div class="edit-car-overlay-icon">
									<img src="../../public/icons/agregar.png" alt="" @click="addCarToList(car._id, car.linkImage)">
								</div>
							</div>
						</div>
						<PaginationCars></PaginationCars>
						<div v-if="!isEditingListName" class="edit-carlist-listname">
							<p> <strong>Nombre de la lista:</strong> "{{ listData[selectedListIndex].listName }}"</p>
							<img src="../../public/icons/editar.png" alt="editar nombre" @click="editingListName">
						</div>

						<div v-else class="edit-carlist-listname">
							<input v-model="editedListName" @keyup.enter="saveEditingListName" />
							<img src="../../public/icons/check.png" alt="aceptar" @click="saveEditingListName">
							<img src="../../public/icons/cerrar.png" alt="cerrar" @click="cancelEditingListName">

						</div>

						<div class="my-list-edit">
							<div v-for="(car, index) in actualEditListCars" class="edit-car-overlay">
								<img :src="car" alt="">
								<div class="edit-car-overlay-icon">
									<img src="../../public/icons/quitar.png" alt="" @click="deleteCarToList(index)">
								</div>
							</div>
						</div>
						<span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
						<div v-if="showEditCarList" class="bottom-edit-content">
							<button @click="modifyChangesList">Guardar</button>
							<button @click="closeEditCarList">Cancelar</button>
						</div>
						<div v-if="showAddCarList" class="bottom-edit-content">
							<button @click="addNewList">Guardar</button>
							<button @click="closeAddCarList">Cancelar</button>
						</div>
					</div>
				</div>
			</div>

			<div class="bottom-edit-content">
				<button @click="openAddCarList"> Añadir lista</button>
			</div>

		</div>

		<h2 v-if="!publicProfile">Listas favoritas</h2>
		<div v-if="!publicProfile" class="section-list-favorite-lists">
			<div v-for="(list, index) in likedLists" :key="index">
				<List :list="list" />
			</div>
		</div>


		<h2 v-if="publicProfile">Listas publicadas</h2>
		<div v-if="publicProfile" class="section-list-favorite-lists">
			<div v-for="(list, index) in userStore.userID.carsList.filter(item => item.posted)" :key="index">
				<List :list="list" />
			</div>
		</div>
	</div>

</template>


<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore';
import { useImageStore } from '../stores/imageStore';
import { useCarStore } from '../stores/carStore'
import List from '../components/List.vue';
import MainSearchBar from './MainSearchBar.vue';
import PaginationCars from './PaginationCars.vue';
import { ref } from 'vue'
import { useListStore } from '../stores/listStore';

const router = useRouter();

const userStore = useUserStore();
const imageStore = useImageStore()
const carStore = useCarStore()
const carListStore = useListStore()

const userData = ref({})
const showModal = ref(false)
const showEditAvatar = ref(false)

const showFollower = ref(false)
const showFollowing = ref(false)

const listData = ref([])
const actualEditListCars = ref([])
const selectedListIndex = ref(null)
const showDeleteCarList = ref(false)
const showEditCarList = ref(false)
const isEditingListName = ref(false)
const editedListName = ref('')
const isHoveringButton = ref(false);

const showAddCarList = ref(false)

const errorMessage = ref('')
const errorTimeout = ref(null)

const publicProfile = ref(false)
const isProfileFollowed = ref(false)
const likedLists = ref(null)

const loadAllCarImages = async () => {
	try {
		await carStore.getCarsByList(userStore.carsList)
	} catch (error) {
		console.error('Error al cargar las imágenes de los coches:', error);
	}
}

// Computed para generar un mensaje basado en el estado de carga del usuario
const userMessage = computed(() => {
	if (userStore.isLoading) {
		return 'Cargando datos del usuario...';
	} else if (!userStore.username) {
		return 'No se encontró información del usuario.';
	} else {
		return null;
	}
});


const props = defineProps({
	userId: {
		type: String,
		required: false
	}
})



// Obtener datos del usuario al montar
const loadUserProfile = async () => {
	try {
		if (userStore.id != props.userId && props.userId != undefined) {
			await userStore.fetchUsersById(props.userId)
			isProfileFollowed.value = profileFollowed()
			publicProfile.value = true
		} else {
			await userStore.fetchLoggedUser()
			await imageStore.fetchImages()
			await loadAllCarImages()
			likedLists.value = userStore.likedLists
			isProfileFollowed.value = false
			publicProfile.value = false
		}

	} catch (error) {
		console.error('Error en el onMounted de UserData: ', error)
	}
}


onMounted(loadUserProfile)


// Para perfil publico
const profileFollowed = () => {
	if (userStore.following.length == 0) return false

	// Si es un tipo de estructura que solo contenga ids(sin keys)
	if (userStore.following[0]._id == undefined) {
		if (userStore.following.includes(userStore.userID._id)) {
			return true
		}
		return false

	} else {
		for (const follow of userStore.following) {
			if (follow._id === userStore.userID._id) {
				return true
			}
		}
		return false
	}
}


const followUser = async () => {
	try {
		await userStore.followUser(userStore.userID._id)
		isProfileFollowed.value = true
		userStore.userID.followers.push(userStore.id)
	} catch (error) {
		console.error('Error al seguir al usuario: ', error)
	}
}

const unfollowUser = async () => {
	try {
		await userStore.unfollowUser(userStore.userID._id)
		isProfileFollowed.value = false
		userStore.userID.followers = userStore.userID.followers.filter(user => user != userStore.id)
	} catch (error) {
		console.error('Error al dejar de seguir al usuario: ', error)
	}
}

const handleFollowClick = async () => {
	try {
		if (!isProfileFollowed.value) {
			await followUser()
		} else {
			await unfollowUser()
		}
	} catch (error) {
		console.error('Error al intentar seguir o dejar de seguir')
	}
}

// Para perfil privado

const openShowFollower = async () => {
	if (userStore.followers.length == 0) return
	showFollower.value = true
	await userStore.getFollowers(userStore.id)
}

const closeShowFollower = () => {
	showFollower.value = false
}

const openShowFollowing = async () => {
	if (userStore.following.length == 0) return
	showFollowing.value = true
	await userStore.getFollowing(userStore.id)
}

const closeShowFollowing = () => {
	showFollowing.value = false
}

const getUserAvatar = (avatarId) => {
	return imageStore.images.find(image => image._id === avatarId).linkImage
}

const goToUserProfile = (userId) => {
	router.push(`/userprofile/${userId}`)
	closeShowFollower()
	closeShowFollowing()
}

const openEditAvatar = () => {
	showEditAvatar.value = true
}

const closeEditAvatar = () => {
	showEditAvatar.value = false
}

const selectedAvatar = (image) => {
	userData.value.avatarId = image._id
	userData.value.userimg = image.linkImage
	closeEditAvatar()
}


const openModal = () => {
	userData.value = { ...userStore }
	showModal.value = true
}

const closeModal = () => {
	showModal.value = false
}

const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
};

const validateEmail = () => {
	if (!isValidEmail(userData.value.email)) {
		errorMessage.value = "Por favor, introduce un email válido.";
	} else {
		errorMessage.value = ""; // Limpiar el error si el email es válido
	}
};

const saveChanges = async () => {

	validateEmail(); // Validar el email antes de guardar
	if (errorMessage.value) {
		return; // Si hay un error, no continúa
	}

	try {
		// Construir el payload dinámicamente desde `userData`
		const userId = userStore.id; // Suponiendo que tienes el ID del usuario almacenado en la store
		const name = userData.value.name || null; // Si no hay cambios, será null
		const email = userData.value.email || null; // Si no hay cambios, será null
		const avatarId = userData.value.avatarId || null; // Si no hay cambios, será null

		// Llamar a la función del backend
		await userStore.changeUser(userId, name, email, avatarId);

		// Actualizar los valores locales después de una solicitud exitosa
		if (name) userStore.name = name;
		if (email) userStore.email = email;
		if (avatarId) {
			userStore.avatarId = avatarId;
			userStore.userimg = userData.value.userimg
		}

		// Cerrar el modal
		closeModal();

	} catch (error) {
		console.error('Error al guardar los cambios:', error);
	}

};

const openEditCarList = async (index) => {
	showEditCarList.value = true
	selectedListIndex.value = index
	listData.value = JSON.parse(JSON.stringify(userStore.carsList))
	actualEditListCars.value = JSON.parse(JSON.stringify(carStore.carsByList[selectedListIndex.value]))
	await carStore.fetchCars()
}

const closeEditCarList = () => {
	showEditCarList.value = false
	selectedListIndex.value = null
	listData.value = []
	actualEditListCars.value = []
}

const openDeleteCarList = (index) => {
	showDeleteCarList.value = true
	selectedListIndex.value = index
}

const closeDeleteCarList = () => {
	showDeleteCarList.value = false
	selectedListIndex.value = null
}

const openAddCarList = async () => {
	showAddCarList.value = true
	listData.value = JSON.parse(JSON.stringify(userStore.carsList))
	const newList = {
		listName: 'Nueva lista',
		posted: false,
		cars: []
	}
	listData.value.push(newList)
	selectedListIndex.value = listData.value.length - 1
	actualEditListCars.value = []
	await carStore.fetchCars()
}

const closeAddCarList = () => {
	showAddCarList.value = false
	selectedListIndex.value = null
}

const addNewList = async () => {
	try {

		if (listData.value[selectedListIndex.value].cars.length === 0) {
			errorMessage.value = 'La lista no puede estar vacía'
			errorTimeout.value = setTimeout(() => {
				errorMessage.value = '';
			}, 3000);
			return
		}

		const listName = listData.value[selectedListIndex.value].listName
		const cars = listData.value[selectedListIndex.value].cars
		const posted = listData.value[selectedListIndex.value].posted

		await carListStore.createCarList(listName, cars, posted)
		userStore.carsList.push(listData.value[selectedListIndex.value])
		await loadAllCarImages()
		await userStore.fetchLoggedUser()
		closeAddCarList()

	} catch (error) {
		console.error("Error guardando la lista: ", error)
	}
}

const deleteCarList = async () => {

	if (selectedListIndex.value !== null) {

		try {

			// Obtener id de la list
			const listId = userStore.carsList[selectedListIndex.value]._id

			// Borrar la lista de la lista de coches
			await carListStore.deleteCarListById(listId)

			// Borrar la lista asociada al usuario
			userStore.carsList.splice(selectedListIndex.value, 1)
			carStore.carsByList.splice(selectedListIndex.value, 1)

			closeDeleteCarList()

		} catch (error) {
			console.error('Error al eliminar la lista:', error)
		}
	}

}

const addCarToList = (carId, linkImage) => {

	if (listData.value[selectedListIndex.value].length === 0 || !listData.value[selectedListIndex.value].cars.includes(carId)) {
		listData.value[selectedListIndex.value].cars.push(carId)
		actualEditListCars.value.push(linkImage)

	} else {
		errorMessage.value = 'El coche ya está en la lista.';

		// Limpiar temporizador anterior si existe
		if (errorTimeout.value) {
			clearTimeout(errorTimeout.value);
		}

		// Ocultar el mensaje después de 3 segundos
		errorTimeout.value = setTimeout(() => {
			errorMessage.value = '';
		}, 3000);
	}

}

const deleteCarToList = (index) => {
	listData.value[selectedListIndex.value].cars.splice(index, 1)
	actualEditListCars.value.splice(index, 1)
}

const editingListName = () => {
	editedListName.value = listData.value[selectedListIndex.value].listName
	isEditingListName.value = true
}

const cancelEditingListName = () => {
	isEditingListName.value = false
}

const saveEditingListName = () => {
	listData.value[selectedListIndex.value].listName = editedListName.value
	isEditingListName.value = false
}

const editPostedTrue = () => {
	listData.value[selectedListIndex.value].posted = true
}

const editPostedFalse = () => {
	listData.value[selectedListIndex.value].posted = false
}

const onMouseEnter = () => {
	isHoveringButton.value = true;
};

const onMouseLeave = () => {
	isHoveringButton.value = false;
};

const modifyChangesList = async () => {

	try {

		if (listData.value[selectedListIndex.value].cars.length === 0) {
			errorMessage.value = 'La lista no puede estar vacía'
			errorTimeout.value = setTimeout(() => {
				errorMessage.value = '';
			}, 3000);
			return
		}

		const listId = listData.value[selectedListIndex.value]._id
		const listName = listData.value[selectedListIndex.value].listName
		const cars = listData.value[selectedListIndex.value].cars
		const posted = listData.value[selectedListIndex.value].posted

		await carListStore.modifyCarListById(listName, cars, posted, listId)
		userStore.carsList[selectedListIndex.value] = listData.value[selectedListIndex.value]
		await loadAllCarImages()

		closeEditCarList()

	} catch (error) {
		console.error("Error guardando la lista: ", error)
	}
}

</script>


<style scoped>
h1 {
	margin-top: 120px;
}

.container {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 50px;
}

/* CONTENEDOR GLOBAL */
.user-container {
	height: 100%;
	min-width: 400px;
	width: 400px;
	position: fixed;
	top: 100px;
	left: 0;
	text-align: center;
	background-color: var(--color-terciary1);
	box-shadow: var(--shadow-primary1);
}

.user-container * {
	color: var(--color-primary1);
}

.upper-profile-data {
	height: 300px;
	width: 100%;
	padding-top: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: var(--color-primary1);
}

.upper-profile-data button {
	min-width: 30%;
	width: auto;
	max-width: 60%;
	padding: 10px 20px;
	background-color: var(--color-secondary1);
	color: white;
	border-radius: 8px;
	font-size: 16px;
	border: none;
	transition: 0.2s ease;
	cursor: pointer;
}

.upper-profile-data button:hover {
	transform: scale(1.05);
}

.upper-profile-data h2 {
	font-size: 35px;
	color: var(--color-terciary1);
}

.edit-overlay {
	height: 100%;
	width: 100%;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 50px;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 1;
}

.edit-button {
	position: relative;
	left: 40%;
	cursor: pointer;
	transition: 0.2s ease;
}

.title-edit {
	width: 100%;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--color-primary1);
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	border: none;
}

.profile-edit {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: var(--color-primary1);
}


.profile-edit img {
	cursor: pointer;
	transition: 0.2s ease;
}

.profile-edit img:hover {
	transform: scale(1.05);
}


.edit-avatar-overlay {
	height: 250px;
	width: 80%;
	max-width: 800px;
	position: fixed;
	top: 250px;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: var(--color-primary2);
	border-radius: 12px;
	border: 2px solid var(--color-primary1);
	position: fixed;
	color: var(--color-primary1);
}

.avatar-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 95%;
	height: 70%;
	gap: 15px;
	padding: 5px;
	overflow-y: auto;
	margin-bottom: 10px;
	scrollbar-width: thin;
}

.image-container {
	width: 60px;
	height: 60px;
	border-radius: 60px;
	object-fit: cover;
	border: 1px solid var(--color-secondary1);

}

.edit-content {
	width: 80%;
	max-width: 600px;
	height: 600px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background-color: var(--color-terciary1);
	border-radius: 12px;
	text-align: center;
	border: 1px solid var(--color-primary1);
}

.edit-content form {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.bottom-edit-content {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 10px;
	width: 100%;
	padding-bottom: 20px;
}

.bottom-edit-content button {
	width: 30%;
	padding: 10px 20px;
	background-color: var(--color-secondary1);
	color: white;
	border-radius: 8px;
	font-size: 16px;
	border: none;
	transition: 0.2s ease;
	cursor: pointer;
}

.bottom-edit-content button:hover {
	transform: scale(1.05);
}

.input-form-item {
	width: 100%;
	height: 100%;
	text-align: left;
	flex-direction: column;
	height: 55px;
	width: 90%;
	border: 1px solid black;
	border-radius: 12px;
	padding: 5px;
	transition: 0.2s ease;
}

.input-form-item:hover {
	border-color: var(--color-secondary1);
}

.input-form-item label {
	font-size: 12px;
	color: black;
	font-weight: 300;
	margin: 0;
}

.input-form-item input {
	width: 100%;
	height: 50%;
	background: none;
	border: 0;
}


.input-form-item input:focus {
	outline: none;
}

.error-message {
	display: block;
	margin-top: 10px;
	color: red;
	font-size: 12px;
}


.edit-button:hover {
	transform: scale(1.05);
}

.profile-data {
	height: 100%;
	max-height: 300px;
	width: 400px;
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	justify-content: start;
}

.profile-data-edit {
	height: 100%;
	max-height: 300px;
	width: 400px;
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.profile-data1 {
	height: 100px;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.profile-data1 .user-item {
	min-width: 120px;
}

.profile-data2 {
	height: 100px;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.profile-data2 .user-item:nth-child(1) {
	width: 120px;
}

.profile-data2 .user-item {
	width: 80px;
}

.user-item {
	text-align: left;
	height: 55px;
	width: auto;
	border: 1px solid black;
	border-radius: 12px;
	padding: 8px;
}

.user-item-interactive {
	cursor: pointer;
	transition: 0.2s ease;
}

.user-item-interactive:hover {
	border-color: var(--color-secondary1);
}

.layout-background-fw {
	height: 100%;
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
}

.layout-fw {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: auto;
	max-height: 550px;
	max-width: 400px;
	width: 250px;
	margin-top: 100px;
	background-color: var(--color-primary1);
	color: var(--color-terciary1);
	border: 1px solid var(--color-terciary1);
	border-radius: 12px;
	gap: 10px;
	overflow-y: auto;
}

.layout-fw button {
	min-width: 50%;
	width: auto;
	max-width: 60%;
	padding: 10px 20px;
	background-color: var(--color-secondary1);
	color: white;
	border-radius: 8px;
	font-size: 16px;
	border: none;
	transition: 0.2s ease;
	cursor: pointer;
	margin-bottom: 10px;
}

.layout-fw button:hover {
	transform: scale(1.05);
}

.all-user-fw {
	width: 100%;
	height: 100%;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.user-fw {
	width: auto;
	height: 50px;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	transition: 0.2s ease;
	border-radius: 8px;
	padding: 5px;
}

.user-fw:hover {
	background-color: var(--color-primary2);
}

.user-fw img {
	width: 40px;
	height: 40px;
}

.user-item .title-item {
	font-size: 12px;
	color: black;
	font-weight: 300;
	margin: 0;
}

.user-avatar {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	box-shadow: var(--shadow-primary1);
}


h2 {
	color: white;
	font-size: 30px;
}

.section-list {
	height: 100%;
	width: calc(100% - 400px);
	min-height: 90vh;
	position: relative;
	left: 400px;
	top: 100px;
	display: flex;
	text-align: center;
	flex-direction: column;
}

.section-list-my-cars {
	display: flex;
	height: 100%;
	width: 100%;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: center;
	margin-top: 20px;
	gap: 20px;
}

.my-list {
	width: 200px;
	height: 200px;
	position: relative;
	object-fit: cover;
	transition: 0.2s ease;
	margin-top: 10px;
	box-shadow: var(--shadow-primary1);
}

.my-list img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12px;
	transition: 0.2s ease;
}

.icon-overlay {
	width: 100%;
	height: 100%;
	position: absolute;
	background-color: var(--color-primary2);
	border-radius: 12px;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	opacity: 0;
	transition: 0.2s ease;
}

.icon-overlay img {
	width: 32px;
	height: 32px;
	cursor: pointer;
	border-radius: 0;
}

.my-list:hover .icon-overlay {
	opacity: 1;
}

.icon-overlay img:hover {
	transform: scale(1.05);
}

.edit-carlist-overlay-background {
	height: 100%;
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 5;
}

.edit-carlist-overlay {
	min-width: 350px;
	width: auto;
	max-width: 90%;
	min-height: 150px;
	height: auto;
	max-height: 550px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	gap: 10px;
	margin-top: 100px;
	box-shadow: var(--shadow-primary1);
	background-color: var(--color-primary2);
	padding: 15px;
}

.edit-carlist-overlay-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 10px;
	padding-right: 10px;
}

.edit-carlist-overlay-top button {
	text-align: center;
	width: 110px;
	padding: 5px;
	color: white;
	border-radius: 8px;
	font-size: 16px;
	border: none;
	transition: 0.2s ease;
	cursor: pointer;
}

.edit-carlist-overlay-top button:hover {
	transform: scale(1.05);
}

.edit-carlist-listname {
	display: flex;
	align-items: center;
	gap: 10px;
}

.edit-carlist-listname img {
	width: 20px;
	height: 20px;
	cursor: pointer;
	transition: 0.2s ease;
}


.edit-carlist-listname img:hover {
	transform: scale(1.05);
}

.edit-carlist-listname input {
	text-align: left;
	height: 25px;
	border: 1px solid black;
	border-radius: 12px;
	padding: 3px;
}

.my-list-edit {
	width: 100%;
	height: 100%;
	max-height: 150px;
	max-width: 1000px;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 10px;
	gap: 10px;
	overflow-y: auto;
}

.my-list-edit div {
	width: 150px;
	height: 150px;
}

.my-list-edit img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12px;
	box-shadow: var(--shadow-primary1);
}

.all-cars-add {
	width: 100%;
	height: 100%;
	max-height: 150px;
	max-width: 1000px;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 10px;
	gap: 10px;
	overflow-y: auto;
}

.all-cars-add div {
	width: 150px;
	height: 150px;
}

.all-cars-add img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12px;
	box-shadow: var(--shadow-primary1);
}

.edit-car-overlay {
	position: relative;
}

.edit-car-overlay-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	background-color: var(--color-primary2);
	border-radius: 12px;
	opacity: 0;
	transition: 0.2s ease;
}

.edit-car-overlay-icon img {
	width: 32px;
	height: 32px;
	transition: 0.2s ease;
	border-radius: 0;
	box-shadow: none;
}

.edit-car-overlay img:hover {
	cursor: pointer;
	transform: scale(1.05);
}

.edit-car-overlay:hover .edit-car-overlay-icon {
	opacity: 1;
}


.section-list-favorite-lists {
	height: 100%;
	padding: 20px;
	align-items: center;
	text-align: start;
	display: flex;
	flex-direction: column;
}

@media (max-width: 1024px) {

	.my-list-edit div {
		height: 100px;
		width: 100px;
	}

	.all-cars-add div {
		width: 100px;
		height: 100px;
	}

}


@media (max-width: 1100px) {

	.user-container {
		width: 400px;
		height: 750px;
		position: relative;
		left: 50%;
		transform: translate(-50%, -50%);
		top: 470px;
	}

	.section-list {
		width: 100%;
		left: 0;
	}

}
</style>
