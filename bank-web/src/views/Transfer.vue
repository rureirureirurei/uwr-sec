<script>
// Ensure global availability for use in inline event handlers
window.appFunctions = {
  cardNumber: '1234567891011121',
  showModal: false,

  promptTransfer: function() {
    window.appFunctions.showModal = true;
    // Update visibility in the DOM, e.g., display modal
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('displayCardNumber').textContent = window.appFunctions.cardNumber;
  },

  handleTransfer: function() {
    console.log(window.appFunctions.cardNumber);
    window.appFunctions.showModal = false;
    document.getElementById('modal').style.display = 'none';

    const apiUrl = 'https://localhost:3337/transfer';
    const data = {
      cardNumber: window.appFunctions.cardNumber
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
  },

  cancelTransfer: function() {
    window.appFunctions.showModal = false;
    document.getElementById('modal').style.display = 'none';
  }
};
</script>

<template>
  <main>
    <input onchange="window.appFunctions.cardNumber = this.value"/>
    <button onclick="window.appFunctions.promptTransfer()">Transfer funds</button>

    <!-- Modal for confirmation -->
    <div id="modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; display: flex; flex-direction: column; align-items: center;">
        <p>Do you want to send funds to this card number: <span id="displayCardNumber"></span>?</p>
        <button id="yesBtn" onclick="window.appFunctions.handleTransfer()" style="margin: 10px;">Yes</button>
        <button onclick="window.appFunctions.cancelTransfer()" style="margin: 10px;">No</button>
      </div>
    </div>
  </main>
</template>