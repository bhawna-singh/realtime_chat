const express=require('express')
const path=require('path')
const socketio=require('socket.io')
const http=require('http') //already available in nodejs model need not install

const app=express();
const server=http.createServer(app)                        //instead of app.listen connect the app in this way
const io=socketio(server)

let usersockets={}

app.use('/',express.static(path.join(__dirname,'frontend')))  //to make frontend folder available to our express app
io.on('connection',(socket)=>{
console.log("new socket formed from"+socket.id) //after the connection has been established
socket.emit('connected')

socket.on('login',(data)=>{
    //username is in data.user
    usersockets[data.user]=socket.id
    console.log(usersockets)
})

socket.on('send_msg',(data)=>{
//here if we write io.emit then msg is sent to all the sockets connected to the localhost
//if we write socket.broadcast.emit then only to others and not to myself
if(data.message.startsWith('@')){
  //data.message=@shaan:hello
  //split at semicolon , then remove @ from beginning
  let recipient=data.message.split(':')[0].substr(1)
  let rcptSocket=usersockets[recipient]
  //to sen to a particular socket not to everybody else
  socket.to(rcptSocket).emit('recv_msg',data)
}
else{
//here if we write io.emit then msg is sent to all the sockets connected to the localhost
//if we write socket.broadcast.emit then only to others and not to myself
    socket.broadcast.emit('recv_msg',data)
     // console.log("recieved message =" +data.message)
}

})
})

server.listen(2345,()=>console.log("website open on http://localhost:2345"))

