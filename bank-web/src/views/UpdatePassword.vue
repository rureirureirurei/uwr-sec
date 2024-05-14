<script setup>
import { ref } from 'vue';
import axios from "axios";
import { useRoute } from 'vue-router'
import router from "@/router/index.js";
const route = useRoute()
const password = ref('');
const updatePassword = async() => {
  try {
    const response = await axios.post('https://localhost:3337/update/password', {
      token: route.params.token,
      password: password.value,
    });
    alert(`Password updated`);
    await router.push({name: 'auth'})
  } catch (error) {
    alert('Reset failed: ' + JSON.stringify(error.response.data));
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; margin-bottom: 0.5rem;">
    <input placeholder="New Password" v-model="password" style="margin-top: 0.5rem; font-size: 1rem;"/>
    <button class="reset-btn" @click="updatePassword"> Update Password </button>
  </div>
</template>

<style scoped>

.reset-btn {
  font-size: 1rem; /* Larger font size */
  padding: 10px; /* Larger padding for better touch interaction */
  margin: 20px 0; /* Add some space between inputs/buttons */
  border: solid rgba(44, 62, 80, 0.6) 1px;
  background-color: white;
}
.reset-btn:hover {
  cursor: pointer;
}
</style>