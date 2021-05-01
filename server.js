const express=require("express");
const path= require("path");
const http=require("http");
const socketio=require("socket.io");
const formatMessage=require('./utils/message');
const {userJoin,getCurrentUser,userLeaves,getRoomUsers}=require('./utils/users');

const app=express();
const server=http.createServer(app);
const io=socketio(server);

const botname='chatcord';
app.use(express.static(path.join(__dirname,"Public")));

io.on('connection', socket=>{
    console.log("new websocket connection");

    socket.on("join",({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit("welcome",formatMessage(botname,`Welcome ${user.username} to the Chat!`));

        socket.broadcast.to(user.room).emit("newuser",formatMessage(botname,`${user.username} has joined the chat` ));
        io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    })
    
    socket.on("chat-msg",(msg)=>{
        const user=getCurrentUser(socket.id);
        console.log(msg)
        io.to(user.room).emit("msg",formatMessage(user.username,msg));
    });

    socket.on("disconnect",()=>{
        const user=userLeaves(socket.id);
        if(user){io.to(user.room).emit("left",formatMessage(botname,`${user.username} has left the chat!`));
    }
    console.log(user.room);
    io.to(user.room).emit('roomusers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });
    });
});
const PORT=process.env.PORT;

server.listen(PORT,()=> console.log("server has started! on ",PORT)); 
