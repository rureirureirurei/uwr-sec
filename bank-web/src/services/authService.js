import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import router from "@/router/routes.js";

export const authService = {
  signIn: async (email, password) => {
    try {
      const response = await axios.post('https://localhost:3337/auth/signin', {
        email: email,
        password: password
      })
      const auth = useAuthStore()
      auth.setEmail(response.data.email)
      auth.setToken(response.data.token);
      await router.push({ name: 'transfer'})
    } catch (error) {
      alert('Sign in failed 😢: ' + error);
    }
  },
  signUp: async (email, password) => {
    try {
      const response = await axios.post('https://localhost:3337/auth/signup', {
        email: email,
        password: password
      })
      alert('Sign up successful: ' + response.data)
    } catch (error) {
      alert('Sign up failed: ' + error.response.data)
    }
  },
  reset: async()
}
