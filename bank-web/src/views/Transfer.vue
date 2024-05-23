<template>
  <main>
    <div class="transfer-form">
      <input
          v-model="cardNumber"
          placeholder="Enter card number"
          class="input"
      />
      <input
          v-model="amount"
          placeholder="Amount"
          class="input"
          style="max-width: 5rem;"
      />
      <button @click="promptTransfer" class="button">Transfer funds</button>
    </div>
    <!-- Modal for confirmation -->
    <div id="modal" v-if="showModal" class="modal">
      <div class="modal-content">
        <p>Do you want to send {{amount}}$ to <span>{{ cardNumber }}</span>?</p>
        <div class="modal-buttons">
          <button @click="handleTransfer" class="button">Yes</button>
          <button @click="cancelTransfer" class="button">No</button>
        </div>
      </div>
    </div>
    <!-- Transactions Table -->
    <table class="transactions-table">
      <thead>
      <tr >
        <th style="background-color: white !important;">destination</th>
        <th style="background-color: white !important;">amount</th>
        <th style="background-color: white !important;">date</th>
      </tr>
      </thead>
        <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id" style="background-color: white !important;">
            <td>{{ transaction.destination }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.date }}</td>
        </tr>
      </tbody>
      </table>

    <footer
        style="margin-top: 5rem; color: blue; text-decoration: underline; cursor: pointer"
        @click="router().push({ name: 'totp' })"
    >enable one-time password</footer>
  </main>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore.js'; // Adjust the import to your actual auth store location
import router from "@/router/routes.js";
import {ref} from "vue";

export default {
  data() {
    return {
      cardNumber: ref(''),
      showModal: false,
      transactions: [],
      amount: ref(0),
    };
  },
  created() {
    this.checkAuthentication();
    this.fetchTransactions();
  },
  methods: {
    router() {
      return router
    },
    checkAuthentication() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        router.push({ name: 'auth' });
      }
    },
    promptTransfer() {
      this.showModal = true;
    },
    handleTransfer() {
      const authStore = useAuthStore();
      this.showModal = false;
      const apiUrl = 'https://localhost:3337/transactions/transfer';
      const data = { destination: this.cardNumber, amount: 123 };

      axios.post(apiUrl, data, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
          .then(response => {
            console.log('Success:', response.data);
            this.fetchTransactions(); // Refresh transactions after transfer
            this.cardNumber = '';
          })
          .catch(error => console.error('Error:', error));
    },
    cancelTransfer() {
      this.showModal = false;
    },
    fetchTransactions() {
      const authStore = useAuthStore();
      const apiUrl = 'https://localhost:3337/transactions/list';
      axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
          .then(response => {
            this.transactions = response.data;
          })
          .catch(error => console.error('Error fetching transactions:', error.message));
    },
  }
};
</script>

<style>
body {
  //font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

.transfer-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid;
  width: 200px;
}

.button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-buttons {
  display: flex;
  margin-top: 1rem;
  gap: 30px;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  overflow: scroll;
}

.transactions-table th,
.transactions-table td {
  padding: 10px;
  border: 1px solid black;
  text-align: left;
}

.transactions-table th {
  background-color: #f2f2f2;
}
</style>
