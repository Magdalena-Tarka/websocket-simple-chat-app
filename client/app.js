const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  if(author === 'Chat Bot') message.classList.add('message--chat-bot');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ({ author, content }) => addMessage(author, content));
socket.on('removeUser', ({ author, content }) => addMessage(author, content));

const login = (e) => {
  e.preventDefault();
  if(!userNameInput.value) {
    alert('Please type your name and log-in');
  } else {
    userName = userNameInput.value;
    loginForm.classList.toggle('show');
    messagesSection.classList.toggle('show');
    socket.emit('join', userName);
  };
}

const sendMessage = (e) => {
  e.preventDefault();
  let messageContent = messageContentInput.value;
  if(!messageContent) {
    alert('Please type your message...');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);
