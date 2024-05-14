<script setup>
import router from "@/router/index.js";

</script>

<template>
  <header style="display: flex; flex-direction: row; justify-content: space-around;">
    Vulnerable Bank. Denys Zinoviev - Cyber Security class at UWR
    <div style="display: flex; flex-direction: column; font-size: 0.8rem; cursor: pointer;">
      <div style="color: blue" @click="router.push({ name: 'auth' })"> login</div>
    </div>
  </header>

  <div style="padding: 5rem 5rem; display: flex; justify-content: center">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  margin-top: 1rem;
  font-size: 1.3rem;
}
</style>
