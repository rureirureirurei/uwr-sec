import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  // Initialize state with values from localStorage
  const token = ref(localStorage.getItem('auth_token'));
  const email = ref(localStorage.getItem('auth_email'));

  // Actions to update token and email
  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('auth_token', newToken);
  }

  function setEmail(newemail) {
    email.value = newemail;
    localStorage.setItem('auth_email', newemail);
  }

  function revoke() {
    email.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
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

  watch(email, (newEmail) => {
    if (newEmail) {
      localStorage.setItem('auth_email', newEmail);
    } else {
      localStorage.removeItem('auth_email');
    }
  });

  return { token, email, setToken, setEmail, isAuthenticated, revoke };
});
