<template>
  <div style="flex-direction: column; display:flex; font-size: 2rem;">
    <div>
      Setup TOTP
      <div v-if="!qrCode">
        <button @click="generateSecret">Generate TOTP Secret</button>
      </div>
      <div v-if="qrCode">
        <p>Scan this QR code with your TOTP app:</p>
        <img :src="qrCode" alt="TOTP QR Code"/>
        <p>Or enter this secret manually: {{ secret }}</p>
      </div>
    </div>
    <div style="flex-direction: column; display:flex;">
      Verify TOTP
      <input v-model="token" placeholder="Enter TOTP Token"/>
      <button @click="verifyToken">Verify Token</button>
      <p v-if="verified !== null">{{ verified ? 'Token Verified' : 'Invalid Token' }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      secret: '',
      qrCode: '',
      token: '',
      verified: null
    };
  },
  methods: {
    async generateSecret() {
      try {
        const response = await axios.post('http://localhost:3337/generate-totp-secret');
        this.secret = response.data.secret;
        this.qrCode = response.data.qrCode;
      } catch (error) {
        console.error('Error generating TOTP secret:', error);
      }
    },
    async verifyToken() {
      try {
        const response = await axios.post('http://localhost:3337/verify-totp', {
          token: this.token,
          secret: this.secret
        });
        this.verified = response.data.verified;
      } catch (error) {
        console.error('Error verifying TOTP token:', error);
      }
    }
  }
};
</script>
