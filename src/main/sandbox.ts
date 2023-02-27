const express = require('express');

const app = express();

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i < num - 1; i++) {
        if (num % i === 0) {
            return false;
        }
    }

    return true;
}

app.get('/:count', (req, res) => {

    let primes = [];
    let n = 0;
    const input = Number(req.params.count);
    const startTimestamp = new Date().getTime();
    while (primes.length < input) {
        if (isPrime(n)) {
            primes.push(n);
        }

        n++;
    }

    const endTimestamp = new Date().getTime();

    const elapsedTime = endTimestamp - startTimestamp;

    res.json({ input, elapsedTime, primes });
});


app.listen(3000, () => {
    console.log('server runnning...');
});