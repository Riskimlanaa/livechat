const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Load chat history
socket.on('chat history', function(msgs) {
    msgs.forEach((msg) => {
        const item = document.createElement('li');
        const username = document.createElement('div');
        username.classList.add('username');
        username.textContent = msg.username;
        const text = document.createElement('div');
        text.textContent = msg.text;
        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = msg.timestamp;
        item.appendChild(username);
        item.appendChild(text);
        item.appendChild(timestamp);
        messages.appendChild(item);
    });
    window.scrollTo(0, document.body.scrollHeight);
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        const message = {
            username: 'User', // Gantilah ini dengan mekanisme untuk mendapatkan nama pengguna yang dinamis
            text: input.value,
            timestamp: new Date().toLocaleTimeString()
        };
        socket.emit('chat message', message);
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    const item = document.createElement('li');
    const username = document.createElement('div');
    username.classList.add('username');
    username.textContent = msg.username;
    const text = document.createElement('div');
    text.textContent = msg.text;
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = msg.timestamp;
    item.appendChild(username);
    item.appendChild(text);
    item.appendChild(timestamp);
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// Handle reset messages
socket.on('reset messages', function() {
    messages.innerHTML = '';
});
