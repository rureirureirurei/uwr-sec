<template>
  <main>
    <div class="transfer-form">
      <input
          v-model="cardNumber"
          @change="updateCardNumber"
          placeholder="Enter card number"
          class="input"
      />
      <button @click="promptTransfer" class="button">Transfer funds</button>
    </div>
    <!-- Modal for confirmation -->
    <div id="modal" v-if="showModal" class="modal">
      <div class="modal-content">
        <p>Do you want to send funds to this card number: <span>{{ cardNumber }}</span>?</p>
        <div class="modal-buttons">
          <button @click="handleTransfer" class="button">Yes</button>
          <button @click="cancelTransfer" class="button">No</button>
        </div>
      </div>
    </div>
    <!-- Transactions Table -->
    <table class="transactions-table">
      <thead>
      <tr>
        <th>destination</th>
        <th>amount</th>
        <th>date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="transaction in transactions" :key="transaction.id">
        <td>{{ transaction.destination }}</td>
        <td>{{ transaction.amount }}</td>
        <td>{{ transaction.date }}</td>
      </tr>
      </tbody>
    </table>
  </main>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.js'; // Adjust the import to your actual auth store location
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      cardNumber: '',
      showModal: false,
      transactions: []
    };
  },
  created() {
    this.checkAuthentication();
    this.fetchTransactions();
  },
  methods: {
    checkAuthentication() {
      const authStore = useAuthStore();
      const router = useRouter();
      if (!authStore.isAuthenticated) {
        router.push({ name: 'auth' });
      }
    },
    updateCardNumber(event) {
      this.cardNumber = event.target.value;
    },
    promptTransfer() {
      this.showModal = true;
    },
    handleTransfer() {
      const authStore = useAuthStore();
      this.showModal = false;
      const apiUrl = 'https://localhost:3337/transfer';
      const data = { destination: this.cardNumber, amount: 123 };

      axios.post(apiUrl, data, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
          .then(response => {
            console.log('Success:', response.data);
            this.fetchTransactions(); // Refresh transactions after transfer
          })
          .catch(error => console.error('Error:', error));
    },
    cancelTransfer() {
      this.showModal = false;
    },
    fetchTransactions() {
      const authStore = useAuthStore();
      const apiUrl = 'https://localhost:3337/transactions';
      axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
          .then(response => {
            this.transactions = response.data;
          })
          .catch(error => console.error('Error fetching transactions:', error.message));
    }
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
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
  border: 1px solid #ccc;
  border-radius: 5px;
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
}

.transactions-table th,
.transactions-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.transactions-table th {
  background-color: #f2f2f2;
}
</style>
