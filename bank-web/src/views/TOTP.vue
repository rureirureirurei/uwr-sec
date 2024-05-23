<template>
  <div style="flex-direction: column; display:flex; font-size: 1rem;">
    <div>
      Setup TOTP
      <div v-if="!qrcode">
        <button @click="generateSecret">Generate TOTP Secret</button>
      </div>
      <div v-if="qrcode">
        <p>Scan this QR code with your TOTP app:</p>
        <img :src="qrcode" alt="TOTP QR Code"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import qrcode from 'qrcode';

export default {
  data() {
    return {
      qrcode: null,
      verified: null,
      token: ''
    };
  },
  methods: {
    async generateSecret() {
      try {
        const response = await axios.post('https://localhost:3337/totp/generate');
        const otpauthUrl = response.data;

        // Generate QR code
        qrcode.toDataURL(otpauthUrl, (err, url) => {
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
      try {
        const response = await axios.post('https://localhost:3337/totp/verify', {
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
