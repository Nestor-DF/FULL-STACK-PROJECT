<template>
	<div class="content-search">
		<div class="search-bar">
			<input v-model="query" @input="handleSearch" @keyup.enter="handleSearchAndNavigate" type="text"
				placeholder="Buscar coches" class="search-input" />
			<button v-if="route.name === 'Home'" @click="handleSearchAndNavigate" class="search-button">Buscar</button>
			<div v-if="route.name === 'AllCars' || route.name === 'Home'" @click="toggleFilters"
				:class="['filter-icon', { 'filter-icon-active': filtersVisible }]">
				&#9776; <!-- Tres rayas para abrir los filtros -->
			</div>

		</div>

		<!-- Mensaje de búsqueda que no se muestra si estamos en la página de inicio (route.name === '/') -->
		<p v-if="route.name === 'AllCars'" class="search-message">
			{{ totalResults }} coches encontrados.
		</p>

		<!-- Contenedor de filtros avanzados que se muestra cuando el usuario hace clic en el icono, solo cuando estan en home o en la lista de todos los coches -->
		<div v-if="filtersVisible && (route.name === 'AllCars' || route.name === 'Home')" class="filters-container">
			<div class="filters-header">
				<h4>Búsqueda avanzada</h4>
			</div>

			<div class="filters-fields">
				<div class="buttons-selection">
					<div class="filters-fields-title">
						Marcas
						<button @click="toggleBrandList" class="toggle-button">
							<img :src="showBrands ? '/icons/up-arrow.png' : '/icons/down-arrow.png'" alt="Toggle arrow" />
						</button>
					</div>

					<div v-if="showBrands" class="buttons">
						<button v-for="brand in brands" :key="brand" @click="toggleBrandSelection(brand)"
							:class="{ 'selected': selectedBrands.includes(brand) }" class="single-button">
							{{ brand }}
						</button>
					</div>

				</div>

				<div class="spec-row-filter">
				</div>

				<div class="buttons-selection">
					<div class="filters-fields-title">
						Países
						<button @click="toggleCountryList" class="toggle-button">
							<img :src="showCountries ? '/icons/up-arrow.png' : '/icons/down-arrow.png'" alt="Toggle arrow" />
						</button>
					</div>
					<div v-if="showCountries" class="buttons">
						<button v-for="countrie in countries" :key="countrie" @click="toggleCountriesSelection(countrie)"
							:class="{ 'selected': selectedCountries.includes(countrie) }" class="single-button">
							{{ countrie }}
						</button>
					</div>
				</div>

				<div class="spec-row-filter">
				</div>

				<div class="buttons-selection">
					<div class="filters-fields-title">
						Tipos de Combustible
						<button @click="toggleFuelTypeList" class="toggle-button">
							<img :src="showFuelTypes ? '/icons/up-arrow.png' : '/icons/down-arrow.png'" alt="Toggle arrow" />
						</button>
					</div>
					<div v-if="showFuelTypes" class="buttons">
						<button v-for="fuelType in fuelTypes" :key="fuelType" @click="toggleFuelTypeSelection(fuelType)"
							:class="{ 'selected': selectedFuelTypes.includes(fuelType) }" class="single-button">
							{{ fuelType }}
						</button>
					</div>
				</div>

				<div class="spec-row-filter">
				</div>

				<div class="buttons-selection">
					<div class="filters-fields-title">
						Tipos de Tracción
						<button @click="toggleTractionTypeList" class="toggle-button">
							<img :src="showTractionTypes ? '/icons/up-arrow.png' : '/icons/down-arrow.png'" alt="Toggle arrow" />
						</button>
					</div>
					<div v-if="showTractionTypes" class="buttons">
						<button v-for="tractionType in tractionTypes" :key="tractionType"
							@click="toggleTractionTypeSelection(tractionType)"
							:class="{ 'selected': selectedTractionTypes.includes(tractionType) }" class="single-button">
							{{ tractionType }}
						</button>
					</div>
				</div>

				<div class="spec-row-filter">
				</div>

				<div class="filter-limits-container">
					<div class="filters-fields-title">
						Velocidad máxima
					</div>

					<div class="filter-input-group">
						<div class="filter-input">
							<label for="min-filter">Límite inferior (km/h)</label>
							<input id="min-filter" v-model.number="minMaximumSpeed" @input="handleSearch" type="number"
								placeholder="Velocidad máxima mínima" class="filter-input" />
						</div>

						<div class="filter-input">
							<label for="max-filter">Límite superior (km/h)</label>
							<input id="max-filter" v-model.number="maxMaximumSpeed" @input="handleSearch" type="number"
								placeholder="Velocidad máxima máxima" class="filter-input" />
						</div>
					</div>
				</div>

				<div class="spec-row-filter">
				</div>

				<div class="filter-limits-container">
					<div class="filters-fields-title">
						Precio
					</div>

					<div class="filter-input-group">
						<div class="filter-input">
							<label for="min-price-filter">Límite inferior (€)</label>
							<input id="min-price-filter" v-model.number="minPrice" @input="handleSearch" type="number"
								placeholder="Precio mínimo" class="filter-input" />
						</div>

						<div class="filter-input">
							<label for="max-price-filter">Límite superior (€)</label>
							<input id="max-price-filter" v-model.number="maxPrice" @input="handleSearch" type="number"
								placeholder="Precio máximo" class="filter-input" />
						</div>
					</div>
				</div>

				<div class="spec-row-filter">
				</div>

				<div class="filter-limits-container">
					<div class="filters-fields-title">
						Año de fabricación
					</div>

					<div class="filter-input-group">
						<div class="filter-input">
							<label for="min-year-filter">Límite inferior</label>
							<input id="min-year-filter" v-model.number="minManufactureYear" @input="handleSearch" type="number"
								placeholder="Año de fabricación mínimo" class="filter-input" />
						</div>

						<div class="filter-input">
							<label for="max-year-filter">Límite superior</label>
							<input id="max-year-filter" v-model.number="maxManufactureYear" @input="handleSearch" type="number"
								placeholder="Año de fabricación máximo" class="filter-input" />
						</div>
					</div>
				</div>

				<div class="spec-row-filter">
				</div>

			</div>

			<button @click="resetFilters" class="reset-button">Resetear filtros</button>

		</div>
	</div>

</template>



<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCarStore } from '../stores/carStore';
import { useRouter, useRoute } from 'vue-router';

const carStore = useCarStore();
const query = ref('');
const totalResults = ref(null);
const router = useRouter();
const route = useRoute();
const isLoading = ref(true); // Variable para gestionar el estado de carga

/** MARCAS */
const brands = ref([]);
const selectedBrands = ref([]);
const toggleBrandSelection = async (brand) => {
	const index = selectedBrands.value.indexOf(brand);
	if (index > -1) {
		selectedBrands.value.splice(index, 1);
	} else {
		selectedBrands.value.push(brand);
	}
	await handleSearch();
};

/** PAÍSES */
const countries = ref([]);
const selectedCountries = ref([]);
const toggleCountriesSelection = async (countrie) => {
	const index = selectedCountries.value.indexOf(countrie);
	if (index > -1) {
		selectedCountries.value.splice(index, 1);
	} else {
		selectedCountries.value.push(countrie);
	}
	await handleSearch();
};

/** TIPOS DE COMBUSTIBLE */
const fuelTypes = ref([]);
const selectedFuelTypes = ref([]);
const toggleFuelTypeSelection = async (fuelType) => {
	const index = selectedFuelTypes.value.indexOf(fuelType);
	if (index > -1) {
		selectedFuelTypes.value.splice(index, 1);
	} else {
		selectedFuelTypes.value.push(fuelType);
	}
	await handleSearch();
};

/** TIPOS DE TRACCIÓN */
const tractionTypes = ref([]);
const selectedTractionTypes = ref([]);
const toggleTractionTypeSelection = async (tractionType) => {
	const index = selectedTractionTypes.value.indexOf(tractionType);
	if (index > -1) {
		selectedTractionTypes.value.splice(index, 1);
	} else {
		selectedTractionTypes.value.push(tractionType);
	}
	await handleSearch();
};

/** VELOCIDAD MÁXIMA */
const maxMaximumSpeed = ref(482);
const minMaximumSpeed = ref(0);

/** PRECIO DE SALIDA */
const minPrice = ref(0);
const maxPrice = ref(18000000);

/** AÑO DE FABRICACIÓN */
const minManufactureYear = ref(0);
const maxManufactureYear = ref(2024);


/** PETICIÓN DE BÚSQUEDA */
const handleSearch = async () => {
	await carStore.fetchCars({
		searchString: query.value,
		brands: selectedBrands.value,
		countries: selectedCountries.value,
		fuelTypes: selectedFuelTypes.value,
		tractionTypes: selectedTractionTypes.value,
		minMaximumSpeed: minMaximumSpeed.value,
		maxMaximumSpeed: maxMaximumSpeed.value,
		minPrice: minPrice.value,
		maxPrice: maxPrice.value,
		minManufactureYear: minManufactureYear.value,
		maxManufactureYear: maxManufactureYear.value,
	});
	totalResults.value = carStore.totalResults;
};


/** UTILIDADES */
// Toggle para mostrar/ocultar los filtros
const filtersVisible = ref(false);
const toggleFilters = () => {
	filtersVisible.value = !filtersVisible.value;
};

// Estado de visibilidad para las listas
const showBrands = ref(false);
const showCountries = ref(false);
const showFuelTypes = ref(false);
const showTractionTypes = ref(false);

// Funciones para alternar la visibilidad de cada filtro con botones
const toggleBrandList = () => (showBrands.value = !showBrands.value);
const toggleCountryList = () => (showCountries.value = !showCountries.value);
const toggleFuelTypeList = () => (showFuelTypes.value = !showFuelTypes.value);
const toggleTractionTypeList = () => (showTractionTypes.value = !showTractionTypes.value);

// Para buscar y navegar a la página de "all-cars"  solo si esta en home
const handleSearchAndNavigate = async () => {
	if (route.name === 'Home') {
		router.push('/all-cars');
	}
	await handleSearch();
}

// Para resetear los filtros
const resetFilters = async () => {
	await carStore.fetchFilters();

	totalResults.value = carStore.totalResults;
	brands.value = carStore.brands;
	countries.value = carStore.countries;
	fuelTypes.value = carStore.fuelTypes;
	tractionTypes.value = carStore.tractionTypes;
	maxMaximumSpeed.value = carStore.maxMaximumSpeed;
	minMaximumSpeed.value = carStore.minMaximumSpeed;
	minPrice.value = carStore.minPrice;
	maxPrice.value = carStore.maxPrice;
	minManufactureYear.value = carStore.minManufactureYear;
	maxManufactureYear.value = carStore.maxManufactureYear;
	await carStore.resetUserFilters()
	selectedBrands.value = carStore.selectedBrands;
	selectedCountries.value = carStore.selectedCountries;
	selectedFuelTypes.value = carStore.selectedFuelTypes;
	selectedTractionTypes.value = carStore.selectedTractionTypes;
	await handleSearch();
}

onMounted(async () => {
	try {
		// solo se aplica la búsqueda manteniendo el filtrado en esas dos páginas
		if (route.name === 'AllCars' || route.name === 'Home') {
			await carStore.fetchFilters();
			totalResults.value = carStore.totalResults;
			brands.value = carStore.brands;
			countries.value = carStore.countries;
			fuelTypes.value = carStore.fuelTypes;
			tractionTypes.value = carStore.tractionTypes;
			selectedBrands.value = carStore.selectedBrands;
			selectedCountries.value = carStore.selectedCountries;
			selectedFuelTypes.value = carStore.selectedFuelTypes;
			selectedTractionTypes.value = carStore.selectedTractionTypes;

			query.value = carStore.filters.searchString;
			maxMaximumSpeed.value = carStore.filters.maxMaximumSpeed;
			minMaximumSpeed.value = carStore.filters.minMaximumSpeed;
			minPrice.value = carStore.filters.minPrice;
			maxPrice.value = carStore.filters.maxPrice;
			minManufactureYear.value = carStore.filters.minManufactureYear;
			maxManufactureYear.value = carStore.filters.maxManufactureYear;
			await handleSearch();
		} else {
			await carStore.resetFilters();  // tambien busca filtros
		}



		isLoading.value = false; // Cambia el estado de carga cuando los filtros estén disponibles

	} catch (error) {
		isLoading.value = false; // Aun si hay error, no se quedará en estado de carga

	}
});
</script>




<style scoped>
/** CONTENEDOR DE BÚSQUEDA */
.content-search {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	gap: 40px;
}

/** BARRA DE BÚSQUEDA */
.search-bar {
	width: 40%;
	min-width: 350px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	padding: 10px 15px;
	border-radius: 8px;
	background-color: var(--color-primary2);
	box-shadow: var(--shadow-primary1);
}

.search-input {
	width: 100%;
	padding: 5px;
	border-radius: 5px;
	border: none;
	color: var(--color-terciary1);
	background-color: var(--color-primary2);
}

.search-input:focus {
	outline: none;
}

.filter-icon {
	cursor: pointer;
	margin-left: 10px;
	font-size: 24px;
	color: var(--color-terciary1);
	transition: color 0.3s ease;
}

.filter-icon:hover {
	color: var(--color-terciary2);
}

.filter-icon-active {
	color: var(--color-secondary1);
}

.filter-icon-active:hover {
	color: var(--color-secondary2);
}

.search-button {
	margin-left: 10px;
	padding: 6px 10px;
	border-radius: 5px;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;
	background-color: var(--color-secondary1);
	color: var(--color-terciary1);
}

.search-button:hover {
	background-color: var(--color-secondary2);
}

.reset-button {
	margin-left: 10px;
	padding: 6px 10px;
	border-radius: 5px;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;
	background-color: var(--color-secondary1);
	color: var(--color-terciary1);
}

.reset-button:hover {
	background-color: var(--color-secondary2);
}


/** CONTENEDOR DE FILTROS */
.filters-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 90%;
	gap: 20px;
	padding: 20px;
	border-radius: 10px;
	background-color: var(--color-primary1);
	box-shadow: var(--shadow-primary1);
}

.search-message {
	font-size: 16px;
	color: var(--color-terciary2);
}

.filters-header {
	color: var(--color-secondary1);
}

.filters-header h4 {
	font-size: 36px;
	margin-top: 10px;
	text-align: center;
	font-weight: normal;
}

.filters-fields {
	width: 80%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 30px;
	text-align: center;
}

.filters-fields-title {
	color: var(--color-terciary1);
	width: 100%;
	display: flex;
	flex-direction: row;
	text-align: center;
	justify-content: center;
	align-items: center;
	gap: 20px;
	font-size: 24px;
	font-weight: normal;
}

.toggle-button {
	margin-top: 10px;
	background: none;
	border: none;
}

.toggle-button img {
	width: 30px;
	height: 30px;
	transition: transform 0.3s ease;
}



/** BOTONES */
.buttons-selection {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.buttons {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 20px;
}

.single-button {
	cursor: pointer;

	font-size: 16px;
	padding: 8px 12px;
	border-radius: 5px;
	border: 1px solid var(--color-primary3);
	background-color: var(--color-primary1);
	box-shadow: var(--shadow-primary1);
	color: var(--color-terciary1);
}

.single-button:hover {
	background-color: var(--color-primary2);
}

.single-button.selected {
	background-color: var(--color-secondary1);
	color: var(--color-terciary1);
}



/** INPUTS */
.filter-limits-container {
	display: flex;
	flex-direction: column;
	gap: 20px;

}

.filter-input-group {
	display: flex;
	flex-direction: row;
}

.filter-input {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
}

.filter-input-group label {
	font-size: 16px;
	color: var(--color-terciary2);
}

.filter-input {
	width: 40%;
	padding: 10px;
	border-radius: 5px;
	justify-content: center;
	text-align: center;
	border: 1px solid var(--color-primary3);
	background-color: var(--color-primary1);
	color: var(--color-terciary1);
}

.filter-input:focus {
	outline: none;
	border-color: var(--color-terciary2);
}



/** LINEA DIVISORIA */
.spec-row-filter {
	width: 100%;
	min-width: 550px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: 1px solid var(--color-primary2);
}



/** RESPONSIVE */
@media (max-width: 1124px) {
	.search-bar {
		width: 70%;
		min-width: 140px;
	}

	.search-message {
		font-size: 12px;
	}

	.filters-container {
		width: 80%;
	}

	.filters-header h4 {
		font-size: 30px;
	}

	.filters-fields {
		width: 90%;
	}

	.spec-row-filter {
		min-width: 350px;
	}
}
</style>
