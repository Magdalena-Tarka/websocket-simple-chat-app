const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send( { message: 'Not found....' } );
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {    // Nasłuchiwacz na automatyczny event ('connection') emitowany przez klienta socket, który się podłącza
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    // Dzięki broadcast emitujemu event do wszystkich socketów, oprócz tego, z którego go wysyłamy
    socket.broadcast.emit('message', message);
  });
  // Nasłuchiwacz na zamknięcie połączenia z klientem, który w momencie zamknięcia również emituje automatyczny event 'disconnect'
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message and disconnect events \n');
});
