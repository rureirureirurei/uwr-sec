<script setup>
import router from "@/router/routes.js";
import {useAuthStore} from "@/stores/auth.js";
import {useRoute} from "vue-router";

const auth = useAuthStore();
const route = useRoute();
const logout = async () => {
  auth.revoke();
  await router.push({ name: 'auth' });
}
</script>

<template>
  <header style="display: flex; flex-direction: row; justify-content: space-around;">
    Vulnerable Bank. Denys Zinoviev - Cyber Security class at UWR
    <div style="display: flex; flex-direction: column; font-size: 0.8rem; cursor: pointer;">
      <div v-if="!auth.isAuthenticated && !(route.name === 'auth')" style="color: blue" @click="router.push({ name: 'auth' })"> login</div>
      <div v-if="auth.isAuthenticated" style="color: firebrick" @click="logout"> log out</div>
    </div>
  </header>
  <span style="font-size: 60%; margin-left: 10%;">pre-alpha</span>

  <div style="padding: 10rem 5rem; display: flex; justify-content: center">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  margin-top: 1rem;
  font-size: 1.3rem;
}
</style>
