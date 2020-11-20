const path = require('path')
const http = require('http')
const express = require ('express')
const pagesRouter = require('./routers/pages')
const socketio = require('socket.io')
const Filter = require('bad-words')
//const { generateMessage } = require('./utils/messages')
const hbs = require('hbs')

const app = express()

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup directory to serve
app.use(express.static(publicDirectoryPath))
app.use(pagesRouter)


io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    // send "welcome" message to new connected clients 
    socket.emit('message', 'Welcome!')

    // send message to all clients except new user
    socket.broadcast.emit('message', 'A new user user has joined!')

    // listen to message from client and send all other clients
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Bad words not allowed')
        }

        io.emit('message', message)
        callback('It arrived!')
    })

    //listen to message from client with gps coordinates and broadcast
    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})


