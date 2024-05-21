import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  // Initialize state with values from localStorage
  const token = ref(localStorage.getItem('auth_token'));
  const login = ref(localStorage.getItem('auth_login'));

  // Actions to update token and login
  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('auth_token', newToken);
  }

  function setLogin(newLogin) {
    login.value = newLogin;
    localStorage.setItem('auth_login', newLogin);
  }

  function revoke() {
    login.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_login');
  }

  // Optional: computed properties if needed
  const isAuthenticated = computed(() => !!token.value);

  // Watchers to automatically update localStorage when values change
  watch(token, (newToken) => {
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  });

  watch(login, (newLogin) => {
    if (newLogin) {
      localStorage.setItem('auth_login', newLogin);
    } else {
      localStorage.removeItem('auth_login');
    }
  });

  return { token, login, setToken, setLogin, isAuthenticated, revoke };
});
