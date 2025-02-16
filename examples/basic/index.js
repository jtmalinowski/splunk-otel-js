const http = require('http');
const { trace } = require('@opentelemetry/api');
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
  const tracer = trace.getTracer('splunk-otel-example-express');
  const span = tracer.startSpan('hello');
  console.log(201, '/hello');
  res.status(201).send('Hello from node\n');
  span.end();
});

app.get('/', (req, res) => {
  axios.get(`http://localhost:${port}/hello`)
    .then((response) => {
      console.log(200, '/');
      res.status(200).send(`Hello from node: ${response.status}\n`);
    })
    .catch((err) => {
      console.log(500, '/', err);
      res.status(500).send(`Error from node: ${err.message}\n`);
    });
});

app.listen(port, 'localhost', () => console.log(`Example app listening on port ${port}!`));
