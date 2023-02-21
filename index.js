const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
})

app.use(cors())

const PORT = process.env.port || 5000

app.get('/', (req, res) => {
  res.send(`server is running`)
})

io.on('connection', (socket) => {
  console.log('new user connected')
  socket.emit('me', socket.id)

  socket.on('disconnect', () => {
    socket.broadcast.emit('callended')
  })

  socket.on('calluser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('calluser', { signal: signalData, from, name })
  })

  socket.on('answercall', (data) => {
    io.to(data.to).emit('callexccepted', data.signal)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running to the port ${PORT} `)
})
