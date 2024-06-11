<template>
  <div style="flex-direction: column; display:flex; font-size: 1rem; justify-content: center; align-items: center;">

    <div v-if="!qrcode" style="display: flex;">
      <button @click="generateSecret" style="border-radius: 0; border: solid black 1px; background-color: white; font-size: 1.2rem; cursor: pointer; padding: 0.5rem;">Generate TOTP Secret</button>
    </div>
    <div v-if="qrcode"style="display: flex; flex-direction: column;">
      <p style="font-size: 1.2rem;">Scan this QR code with your TOTP app:</p>
      <img :src="qrcode" alt="TOTP QR Code"/>
      <div style="cursor: pointer;" @click="copyToClipboard(secret)">{{ secret }}</div>
    </div>


    <div v-if="qrcode">
      <input :placeholder="123456" class="input" style="margin-top: 1rem;" v-model="token"/>
      <button @click="verifyToken" style="border-radius: 0; border:0; background-color: white; font-size: 1.2rem; cursor: pointer; padding: 0.5rem; color:blue;">
        Verify token to confirm enabling TOTP
      </button>
      {{}}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import qrcode from 'qrcode';
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore.js";

export default {
  data() {
    return {
      qrcode: null,
      verified: null,
      token: '',
      secret: ref('')
    };
  },
  methods: {
    copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    },
    async generateSecret() {
      try {
        const authStore = useAuthStore();
        const response = await axios.post(
          'https://localhost:3337/totp/generate',
          {},
          { headers: { 'Authorization': `Bearer ${authStore.token}`} }
        );
        this.secret = response.data.secret

        // Generate QR code
        qrcode.toDataURL(response.data.url, (err, url) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return;
          }
          this.qrcode = url;
        });
      } catch (error) {
        console.error('Error generating TOTP secret:', error);
      }
    },
    async verifyToken() {
      const authStore = useAuthStore();
      const response = await axios.post(
     'https://localhost:3337/totp/verify',
    { code : this.token },
   { headers: { 'Authorization': `Bearer ${authStore.token}`} }
       )
      .then(response => {
        alert('Successfully verified!');
      })
      .catch(error => console.error('Error:', error.response.data));
    }
  }
};
</script>

<style>
.input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid;
  width: 200px;
}

</style>