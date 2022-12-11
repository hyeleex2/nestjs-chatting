const socket = io('/');

const getElementById = (id) => document.getElementById(id);

const helloStrangerEl = getElementById('hello_stranger');
const chattingBoxEl = getElementById('chatting_box');
const formEl = getElementById('chat_form');

function helloUser() {
  const username = prompt('what is your name?');
  // 서버에 전송
  socket.emit('new_user', username, (data) => {
    console.log(data);
  });
  socket.on('hello_user', (data) => {
    alert(data);
  });
}
function init() {
  helloUser();
}

init();
