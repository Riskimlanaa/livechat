const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messagesFile = path.join(__dirname, 'messages.json');

// Load messages from file
let messages = [];
if (fs.existsSync(messagesFile)) {
    const data = fs.readFileSync(messagesFile, 'utf8');
    messages = JSON.parse(data);
}

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');

    // Send existing messages to new client
    socket.emit('chat history', messages);

    socket.on('chat message', (msg) => {
        messages.push(msg);
        io.emit('chat message', msg);

        // Save messages to file
        fs.writeFileSync(messagesFile, JSON.stringify(messages));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Schedule task to reset messages daily
cron.schedule('0 0 * * *', () => {
    messages = [];
    fs.writeFileSync(messagesFile, JSON.stringify(messages));
    io.emit('reset messages');
    console.log('Messages reset at midnight');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
