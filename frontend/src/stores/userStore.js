import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: "",
    userimg: "",
    name: "",
    email: "",
    carsList: [],
    likedLists: [],
    followers: [],
    following: [],

    listLiked: false,
    userID: [],
  }),

  actions: {
    // Obtiene los datos del usuario autenticado
    async fetchLoggedUser() {
      try {
        // Realiza la solicitud a la ruta protegida
        const response = await axios.get("http://localhost:5000/api/users/me");

        const user = response.data.user; // Extrae la información del usuario de la respuesta

        // Actualiza los datos en el estado
        this.username = user.username;
        this.name = user.name || ""; // Por si está vacío en la base de datos
        this.email = user.email;
        this.carsList = user.carsList || [];
        this.likedLists = user.likedLists || [];
        this.userimg = user.avatar.linkImage;
        this.avatarId = user.avatar._id
        this.id = user._id
        this.followers = user.followers
        this.following = user.following
        this.role = user.role
        const token = localStorage.getItem('token');

      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        throw error; // Opcional: lanzar el error para manejarlo en el componente
      }
    },


    // Método para obtener usuario por ID
    async fetchUsersById(id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        this.userID = response.data;
      } catch (error) {
        console.error('Error fetching user by ID:', error);
      }
    },

    // Método para saber si a un usuario le gusta una lista
    async userListLiked(listId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(  // Cambié de PATCH a POST
          'http://localhost:5000/api/users/islistliked',  // Ruta correcta
          { listId },  // Enviar el listId en el cuerpo de la solicitud
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Token JWT en el encabezado
            },
          }
        );

        this.listLiked = response.data.isLiked || false;  // Si no hay isLiked, se asume false

      } catch (error) {
        console.error('Error verificando si el usuario dio "me gusta" a la lista:', error.message);
      }
    },

    // Marcar una lista como "me gusta"
    async like(listId) {
      try {
        const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento
        const response = await axios.patch(
          'http://localhost:5000/api/users/likelist', // Ruta correcta para "like"
          { listId }, // Enviar el ID de la lista en el cuerpo
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
            },
          }
        );
        this.listLiked = true; // Actualizar el estado en la store o componente

      } catch (error) {
        console.error('Error al marcar la lista como "me gusta":', error);
      }
    },

    // Desmarcar una lista de "me gusta"
    async disLike(listId) {
      try {
        const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento
        const response = await axios.patch(
          'http://localhost:5000/api/users/dislikelist', // Ruta para "dislike"
          { listId }, // Enviar el ID de la lista en el cuerpo
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
            },
          }
        );
        this.listLiked = false; // Actualizar el estado en la store

      } catch (error) {
        console.error('Error al desmarcar la lista como "me gusta":', error);
      }
    },

    async changeUser(userId, name, email, avatarId) {
      try {
        const token = localStorage.getItem('token')

        const body = {}
        if (name) body.name = name;
        if (email) body.email = email;
        if (avatarId) body.avatarId = avatarId;


        const response = await axios.patch(
          `http://localhost:5000/api/users/${userId}`, // Ruta para "dislike"
          body, // Enviar el ID de la lista en el cuerpo
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
            },
          }
        );

      } catch (error) {
        console.error('Erro al modificar el usuario: ', error)
      }
    },

    async followUser(userIdToFollow) {
      try {
        const token = localStorage.getItem('token')

        // console.log('Se va a seguir a: ', userIdToFollow)

        const response = await axios.post(
          `http://localhost:5000/api/users/follow`,
          { userIdToFollow }, // Enviar el ID del usuario en el cuerpo
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error('Erro al seguir usuario: ', error)
      }
    },

    async unfollowUser(userIdToUnfollow) {
      try {
        const token = localStorage.getItem('token')

        const response = await axios.post(
          `http://localhost:5000/api/users/unfollow`,
          { userIdToUnfollow }, // Enviar el ID del usuario en el cuerpo
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error('Error al dejar de seguir usuario: ', error)
      }
    },

    async getFollowing(userId) {
      try {
        const token = localStorage.getItem('token')

        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.following = response.data
      } catch (error) {
        console.error('Error al dejar de seguir usuario: ', error)
      }
    },

    async getFollowers(userId) {
      try {
        const token = localStorage.getItem('token')
  
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/followers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        this.followers = response.data
      } catch (error) {
        console.error('Error al dejar de seguir usuario: ', error)
      }
    },

  },



});
