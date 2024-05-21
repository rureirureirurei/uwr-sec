import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null);
  const login = ref(null);

  // Actions to update token and login
  function setToken(newToken) {
    token.value = newToken;
  }

  function setLogin(newLogin) {
    login.value = newLogin;
  }

  function revoke() {
    login.value = null;
    token.value = null;

  }

  // Optional: computed properties if needed
  const isAuthenticated = computed(() => !!(token.value));

  return { token, login, setToken, setLogin, isAuthenticated, revoke };
});
