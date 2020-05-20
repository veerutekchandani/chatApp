var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var server = require('http').createServer(app);
var socketIO = require('socket.io');
var io = socketIO(server);
//var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;


server.listen(port);

app.use(express.static("public"));
app.use(express.static("views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
	extended: true
})); 



app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

app.post('/enter',function(req,res) {
	var username = req.body.username;
	return res.redirect('chat.html?name='+username);
});


io.sockets.on('connection', function(socket){
  	 
  	  socket.on("user_join", function(username) {
  	  	console.log('hello');
        socket.username = username;
        socket.broadcast.emit("user_join", username); // message sent to all users except sender
      });


	  socket.on('chat_message', function(data){
	  	console.log('message sent');
	  	data.username = this.username;
	    io.emit('chat_message', data);
	  });

	  socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", this.username);
      });

});
