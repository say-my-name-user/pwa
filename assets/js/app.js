// register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa/assets/js/sw.js', { scope: '/pwa/' }).then(function(reg) {
        if(reg.installing) {
            console.log('Service worker installing');
        } else if(reg.waiting) {
            console.log('Service worker installed');
        } else if(reg.active) {
            console.log('Service worker active');
        }
    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}

function getRandomQuote() {
    const quote   = document.getElementById('quote'),
          button  = document.getElementById('get-quote'),
          hint    = document.getElementById('hint'),
          request = new XMLHttpRequest();

    request.open('GET', 'assets/data/quotes.json');
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        const keys      = Object.keys(request.response),
              randIndex = Math.floor(Math.random() * keys.length),
              randKey   = keys[randIndex];

        quote.innerHTML  = '"' + request.response[randKey] + '" (c)';
        button.innerText = 'I want to see more!';
        hint.innerText   = request.getResponseHeader('x-service-worker')
            ? '[loaded from the SW cache]'
            : '[requested from the network]';
    }
    request.onerror = function() {
        quote.innerHTML = 'Something went wrong :(';
    };
}