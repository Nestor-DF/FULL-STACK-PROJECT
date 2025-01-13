<template>
  <div class="car">
    <router-link :to="`/car/${carID}`">
      <img :src="carImage" :alt="carModel" />
    </router-link>
    <div class="car-undertext">
      <p>{{ carBrand }} {{ carModel }}</p>
      <p>{{ carPrice }}€</p>
    </div>
  </div>

</template>


<script>
export default {
  name: 'Car',
  props: {
    carBrand: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    carPrice: {
      type: Number,
      required: true,
    },
    carImage: {
      type: String,
      default: 'default-car-image.png',
    },
    carID: {
      type: String,
      required: true,
    },
  },
}
</script>


<style scoped>
.car {
  position: relative;
  width: 550px;
  height: 250px;
  box-shadow: var(--shadow-primary1);
  transition: 0.2s ease;
  border-radius: 10px;
}

.car img {
  object-fit: cover;
  height: 100%;
  max-height: 250px;
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
}

.car-undertext {
  width: 100%;
  height: 50px;
  background-color: var(--color-primary2);
  opacity: 70%;
  position: absolute;
  bottom: 0px;
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: 0.2s ease;
}


.car:hover {
  cursor: pointer;
  transform: scale(1.01);
}

.car:hover .car-undertext {
  opacity: 0.8;
}


/** RESPONSIVE */
@media (max-width: 768px) {
  .car {
    width: 400px;
  }
}
</style>
