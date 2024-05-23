<script setup>
import { ref } from 'vue'
import router from '@/router/routes.js'
import { authService } from '@/services/authService.js'
const email = ref('')
const password = ref('')

const resetPassword = async () => {
  await router.push({ name: 'reset' })
}
</script>

<template>
  <div class="auth-card">
    <input v-model="email" type="text" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="() => authService.signIn(email, password)">Sign In</button>
    <button @click="() => authService.signUp(email, password)">Sign Up</button>
    <button @click="resetPassword" style="color: blue; font-size: 0.8rem; border: none">
      I Forgot Password
    </button>
  </div>
</template>

<style scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  width: 15rem; /* Adjust width as needed */
}

/* Increase font size and adjust input and button sizes */
.auth-card input,
.auth-card button {
  font-size: 1rem; /* Larger font size */
  padding: 10px; /* Larger padding for better touch interaction */
  margin: 5px 0; /* Add some space between inputs/buttons */
  border: solid black 1px;
}

.auth-card button {
  cursor: pointer; /* Improves usability indicating clickable */
  background-color: white;
}
</style>
