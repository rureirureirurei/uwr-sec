<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from "@/router/routes.js";
import {useAuthStore} from "@/stores/auth.js";

const login = ref('');
const password = ref('');
const auth = useAuthStore();

const handleSignIn = async () => {
  try {
    const response = await axios.post('https://localhost:3337/signin', {
      login: login.value,
      password: password.value
    });
    console.log(response.data)
    auth.setLogin(response.data.login);
    auth.setToken(response.data.token);
    await router.push({ name: 'transfer'})
  } catch (error) {
    console.log(error)
    alert('Sign in failed 😢');
  }
};

const handleSignUp = async () => {
  try {
    const response = await axios.post('https://localhost:3337/signup', {
      login: login.value,
      password: password.value
    });
    alert('Sign up successful: ' + response.data);
  } catch (error) {
    alert('Sign up failed: ' + error.response.data);
  }
};

const resetPassword = async() => {
  await router.push({ name: 'reset' });
}
</script>

<template>
  <div class="auth-card">
    <input v-model="login" type="text" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleSignIn">Sign In</button>
    <button @click="handleSignUp">Sign Up</button>
    <button @click="resetPassword" style="color: blue; font-size: 0.8rem; border: none;">I Forgot Password</button>
  </div>
</template>

<style scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  width: 15rem; /* Adjust width as needed */
}

/* Increase font size and adjust input and button sizes */
.auth-card input, .auth-card button {
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
