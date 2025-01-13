// src/stores/newsStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useNewsStore = defineStore("newsStore", {
  state: () => ({
    articles: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: 16,
  }),
  actions: {
    async fetchNews({ page = 1, pageSize = 16 } = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:5000/api/news/latest?page=${page}&pageSize=${pageSize}`);

        const { articles, totalResults, totalPages } = response.data;

        this.articles = articles;
        this.totalResults = totalResults;
        this.currentPage = page;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
      } catch (error) {
        this.error = error.response?.data?.message || "Error al obtener las noticias.";
        console.error("Error fetching news:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
