<script setup>
import { ref } from 'vue';
import axios from "axios";

const email = ref('');
const sendResetEmail = async() => {
  try {
    const response = await axios.post('https://localhost:3337/reset', {
      login: email.value,
    });
    const token = response.data
    const resetLink = `https://localhost:3338/update/password/token/${token}`
    alert(`Reset link: ${resetLink}`);
  } catch (error) {
    alert('Reset failed: ' + JSON.stringify(error.response.data));
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; margin-bottom: 0.5rem;">
    <input placeholder="Your Email" v-model="email" style="margin-top: 0.5rem; font-size: 1rem;"/>
    <button class="reset-btn" @click="sendResetEmail"> Send Reset Email </button>
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