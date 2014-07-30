var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('test.html');
});

var users =
{
    	id: "",
    	connected: false
}
var temp;
var room = "abc";
var room1 = " ";
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var details={};
var users = {};
io.on('connection', function(socket){
  console.log("a user connected");
  console.log(socket.id);
  // console.log(socket.id);
  // socket.to(socket.id).emit('check');
  socket.on('client detail', function(msg){
  	users[msg] ={
  		id: socket.id,
  		connected: false
  	};
  	details[msg] = socket.id;
    console.log(users);
    socket.emit('checkforothers', details, users);
    // io.emit('check');
  	// console.log(socket.id);
  });
   socket.on('display', function(){
  	// console.log(details);
  	io.emit('lista',details,users);
  });
   socket.on('call client',function(name){
    room = name.op + name.cu ;
    console.log(room);
    console.log(users[name.cu].connected);
    users[name.cu].connected = true;
   	socket.to(details[name.op]).emit('to socket', name.cu);
   	socket.join(room);
   });
   socket.on('accepted',function(name){
    room = name.cu + name.op ;
    console.log(room);
    users[name.cu].connected = true;
    // console.log(users[name.cu].connected);
    // console.log(users[name.op].connected);
   	socket.to(details[name.op]).emit('confirm',name.cu,name.op);
   	socket.join(room);
   });
   socket.on('disable buttons', function(a, b){
    io.emit('disable', a, b);
    // var clients = io.sockets.adapter.rooms['abc'];
    // console.log(clients);
    io.in(room).emit('play', details);
   });
   socket.on('divclicked', function(num, t, p1, p2){
      if( t == 0)
        t = 1;
      else
        t = 0;

      console.log(p2);
      console.log(p1);
      room = p2 + p1;
      console.log(room);
      console.log("hererereasod");
      var clients = io.sockets.adapter.rooms[room];
      console.log(clients);
      io.in(room).emit('divputsymbol', num, t);
   });
   socket.on('won', function(winner, loser){
    socket.to(details[winner]).emit('win');
    socket.to(details[loser]).emit('lose');
   });
   socket.on('refresh',function(){
    io.in(room).emit('reload');
   });
   socket.on('disconnect', function(){
      for (var ke in details)
      {
        if (details[ke] == socket.id) 
          {
            io.emit('update', ke);
            delete details[ke];
          }
      } 
  });
   socket.on('GameOver', function(){
    socket.emit('alertgo');
   });
   socket.on('updateuser', function(theuser){
    users[theuser].connected = false;
    console.log("test");
    console.log(details);
    io.emit("updatebuttons", users, theuser, details);
    // var clients = io.sockets.adapter.rooms[room];
    // for (var k in clients)
    //   {
    //       if (k != socket.id)
    //         temp = k;
    //   }
    //   console.log(temp);
    // for (var ke in details)
    //   {
    //       if(details[ke] != temp)
    //       {
    //         console.log(ke);
    //         console.log(details[ke]);
    //         socket.to(details[ke]).emit("updatebuttons", users[theuser], theuser, details);
    //         socket.to(details[ke]).emit("sample");
    //       }
    //   }
      // console.log(k);
   });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});