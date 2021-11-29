const { generateRequestHandler } = require('./src/handlers/generate');

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/generate', async (req, res) => {
  const awsRequestId =  Math.random().toString(36).slice(-9); // random string, eg: 24evbzv1n
  const { statusCode, body } = await generateRequestHandler({
    httpMethod: 'GET',
    queryStringParameters: req.query
  }, { awsRequestId })
  res.status(statusCode).send(body);
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})