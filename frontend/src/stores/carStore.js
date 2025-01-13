import { defineStore } from 'pinia';
import axios from 'axios';

export const useCarStore = defineStore('carStore', {
  state: () => ({
    cars: [],
    carID: null,
    randomCars: [],
    carDetails: null,
    carsByList: [],

    // Paginación
    totalResults: 228,
    currentPage: 1,
    totalPages: 0,
    pageSize: 48,
    filters: {
      searchString: '',
      brands: [],
      countries: [],
      fuelTypes: [],
      tractionTypes: [],
      minMaximumSpeed: 0,
      maxMaximumSpeed: 482,
      minPrice: 0,
      maxPrice: 18000000,
      minManufactureYear: 1,
      maxManufactureYear: 2024,
    },

    // conocer datos de los coches
    brands: [],
    countries: [],
    fuelTypes: [],
    tractionTypes: [],
    minMaximumSpeed: 0,
    maxMaximumSpeed: 482,
    minPrice: 0,
    maxPrice: 18000000,
    minManufactureYear: 1,
    maxManufactureYear: 2024,

    // eleccion de usuario para filtros
    selectedBrands: [],
    selectedCountries: [],
    selectedFuelTypes: [],
    selectedTractionTypes: []
  }),

  actions: {
    async fetchCars({
      page = 1,
      pageSize = 48,
      searchString = '',
      brands = this.brands,
      countries = this.countries,
      fuelTypes = this.fuelTypes,
      tractionTypes = this.tractionTypes,
      minMaximumSpeed = this.minMaximumSpeed,
      maxMaximumSpeed = this.maxMaximumSpeed,
      minPrice = this.minPrice,
      maxPrice = this.maxPrice,
      minManufactureYear = this.minManufactureYear,
      maxManufactureYear = this.maxManufactureYear,
    } = {}) {

      // Actualizamos los filtros de la store
      this.filters = {
        searchString,
        brands,
        countries,
        fuelTypes,
        tractionTypes,
        minMaximumSpeed,
        maxMaximumSpeed,
        minPrice,
        maxPrice,
        minManufactureYear,
        maxManufactureYear,
      };
      this.selectedBrands = brands;
      this.selectedCountries = countries;
      this.selectedFuelTypes = fuelTypes;
      this.selectedTractionTypes = tractionTypes;

      try {
        const response = await axios.post(
          `http://localhost:5000/api/cars/filter?page=${page}&pageSize=${pageSize}`,
          {
            string_clave: this.filters.searchString,
            brands: this.filters.brands,
            countries: this.filters.countries,
            fuelTypes: this.filters.fuelTypes,
            tractionTypes: this.filters.tractionTypes,
            speed: { min: this.filters.minMaximumSpeed, max: this.filters.maxMaximumSpeed },
            price: { min: this.filters.minPrice, max: this.filters.maxPrice },
            manufactureYear: { min: this.filters.minManufactureYear, max: this.filters.maxManufactureYear },
          }
        );
        const { cars, totalResults, totalPages } = response.data;
        this.cars = cars;
        this.totalResults = totalResults;
        this.currentPage = page;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    },

    async fetchFilters() {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/metadata`);
        this.brands = response.data.brands;
        this.countries = response.data.countries;
        this.fuelTypes = response.data.fuelTypes;
        this.tractionTypes = response.data.tractionTypes;
        this.minPrice = response.data.price.min;
        this.maxPrice = response.data.price.max;
        this.maxMaximumSpeed = response.data.maximumSpeed;
        this.minManufactureYear = response.data.manufactureYear.min;
        this.maxManufactureYear = response.data.manufactureYear.max;

      } catch (error) {
        console.error('Error fetching filters for cars:', error);
      }
    },

    async resetUserFilters() {
      this.selectedBrands = [];
      this.selectedCountries = [];
      this.selectedFuelTypes = [];
      this.selectedTractionTypes = [];
    },

    async fetchCarsById(id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
        this.carID = response.data;
      } catch (error) {
        console.error('Error fetching car by ID:', error);
      }
    },

    async fetchRandomCars(limite) {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/random?limit=${limite}`);
        this.randomCars = response.data;
      } catch (error) {
        console.error('Error fetching random cars:', error);
      }
    },

    async getCarsByList(lists) {
      try {
        this.carsByList = []
        for (const list of lists) {
          const carImages = []
          for (const carId of list.cars) {
            await this.fetchCarsById(carId)
            if (this.carID) carImages.push(this.carID.linkImage)
          }
          this.carsByList.push(carImages)
        }
      } catch (error) {
        console.error('Error fetching cars by list: ', error)
      }
    },

    // Borrar un coche
    async deleteCarById(carId) {
      try {

        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/cars/${carId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error('Error deleting the car: ', error)
      }
    },

    // Editar un coche
    async editCarById(carId, body) {
      try {

        const token = localStorage.getItem('token');
        const response = await axios.put(
          `http://localhost:5000/api/cars/${carId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error('Error editing the car: ', error)
      }
    },

    async addCar(body) {
      try {

        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://localhost:5000/api/cars`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data

      } catch (error) {
        console.error('Error adding the car: ', error)
      }
    }

  },
});
