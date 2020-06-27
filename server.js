const express = require('express')
const uuid = require('uuid').v4

var app = express()

// Serve index.html
app.use('/', express.static('./static'))

let clients = []
let results = []

// Serve the server-side event
app.get('/sse', function (req, res) {
  startLogging()
  const clientId = uuid()
  clients.push({ id: clientId, req, res })

  res.setHeader('cache-control', 'no-cache')
  res.setHeader('content-type', 'text/event-stream')
  res.setHeader('connection', 'keep-alive')

  // Why does this fire twice for each client?
  req.on('close', () => {
    console.log('closed')
    res.end()
    const len = clients.length
    clients = clients.filter((client) => client.id !== clientId)
    console.log(`removed ${len - clients.length} clients`)
  })

  // Catch the client up with all responses so far
  results.forEach((result) => {
    res.write(`data: Hello ${result}\n\n`)
  })

  // Send an end marker right away if there's no more data to send
  if (results.length >= 5) {
    res.write('id: -1\ndata:\n\n')
  }
})

function broadcast(options) {
  if (options.id) {
    clients.forEach((client) => client.res.write(`id: ${options.id}\n`))
  }
  clients.forEach((client) => client.res.write(`data: ${options.data}\n\n`))
}

function startLogging() {
  // Add more data every 2 seconds and send to all clients
  const interval = setInterval(() => {
    if (results.length >= 5) {
      clearInterval(interval)
      broadcast({ id: -1 })
    } else {
      const random = Math.random()
      console.log(`Logging new random number ${random}`)
      results.push(random)
      broadcast({ data: `Hello ${results[results.length - 1]}` })
    }
  }, 2000)
}

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
