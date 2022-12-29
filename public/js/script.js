const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id);

const helloStrangerEl = getElementById('hello_stranger');
const chattingBoxEl = getElementById('chatting_box');
const formEl = getElementById('chat_form');

socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected`);
});

socket.on('user_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});

socket.on('disconnect_user', (username) => {
  drawNewChat(`${username} bye...`);
});

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (!inputValue) return;
  socket.emit('submit_chat', inputValue);
  drawNewChat(inputValue);
  event.target.elements[0].value = '';
};

const helloUser = () => {
  const username = prompt('what is your name?');
  // 서버에 전송
  socket.emit('new_user', username, (data) => {
    drawUserName(data);
  });
};

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `<div>${message}</div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxEl.append(wrapperChatBox);
};

const drawUserName = (username) => {
  helloStrangerEl.innerText = `Hello ${username} ^_^`;
};

const init = () => {
  helloUser();
  formEl.addEventListener('submit', handleSubmit);
};

init();
