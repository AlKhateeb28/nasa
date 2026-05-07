const express = require('express');
const app = express();
const activeRequests = new Set();
const port = 8080;

app.use((req, res, next) => {
    const reqId = `${req.method} ${req.url} - ${Date.now()}`;
    activeRequests.add(reqId);
    console.log(`${reqId} начат. Всего: ${activeRequests.size}`);

    res.on('finish', () => {
        activeRequests.delete(reqId);
        console.log(`${reqId} завершен. Осталось: ${activeRequests.size}`);
    });

    next();
});

app.get('/', (req, res) => res.send('Hello'));
app.listen(port, () => {
    console.log(`Express server started on ${port}`);
});