const socket=io();
const chatMessages=document.querySelector('.chat-messages');

const{ username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

socket.on('welcome',data=>{
    outputMesage(data);
});
socket.on("newuser",data=>{
   outputMesage(data);
});
socket.on("left",data=>{
    outputMesage(data);
});
socket.on("msg",data=>{
    console.log(data);
    outputMesage(data);
    chatMessages.scrollTop=chatMessages.scrollHeight;

});
socket.emit("join",{username,room});

socket.on('roomusers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})


// chat messages
 const chat=document.getElementById("chat-form");
 chat.addEventListener('submit',(e)=>{
     e.preventDefault();
     const msg=e.target.elements.msg.value;
     socket.emit('chat-msg',msg);
     e.target.elements.msg.value="";
 })

 function outputMesage(message){
     const div=document.createElement('div');
     div.classList.add("message");
     div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
     <p class="text">
        ${message.msg}
     </p>`;
     document.querySelector('.chat-messages').appendChild(div);
 }

 function outputRoomName(room){
     const roomname=document.getElementById('room-name');
     roomname.innerText=room;
 }

 function outputUsers(users){
    const usersList=document.getElementById('users');
    usersList.innerHTML=`
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
 }

