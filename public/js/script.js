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

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

const drawUserName = (username) => {
  helloStrangerEl.innerText = `Hello ${username} ^_^`;
};

const init = () => {
  helloUser();
  formEl.addEventListener('submit', handleSubmit);
};

init();
