
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/server/index.html');
});

app.get('/html5game',function(req,res){	
	res.sendFile(__dirname + '/game/html5game/');
});

app.use('/game',express.static(__dirname + '/game'));
serv.listen(process.env.PORT|| 2000);

console.log("Server local started.");


var SOCKET_LIST={};

var Player = function(id){
	var self = {
			id:id,
			x:0,
			y:0,
			image_angle:0,
			sprite_index:0,	
			
		}

		self.position = function(data){
				//self.id = data.id;
				self.x =data.x;
				self.y = data.y;
				self.image_angle = data.image_angle;
				self.sprite_index =data.sprite_index;
		}
		
		Player.list[self.id]=self;
		return self;
}

Player.list={};

Player.update = function(){
	
	var pack = [] ;
	
	for(var p in Player.list){
	 var player = Player.list[p];
	  pack.push({
		id:player.id,
		x:player.x,
		y:player.y,
		image_angle:player.image_angle,
		sprite_index:player.sprite_index,

	  });
	
	}

	
	return pack;

}

var io = require('socket.io')(serv,{});
var runId = 0;
io.sockets.on('connection', function(socket){
	//Run socket.id
	runId++;
	socket.id=runId;
	
	SOCKET_LIST[socket.id]=socket;
	var player = Player(socket.id);
	
	socket.on('id',function(data,fn){ //send socket.id to client
			fn(socket.id);
	});
	
    console.log('Socket id :' + socket.id + ' connected'); 
	
	socket.on('disconnect', function() {
		console.log( socket.id + " disconnect ");
		
		delete SOCKET_LIST[socket.id];
		delete Player.list[socket.id];
		
	});
	
	socket.on('position', function(data){
		player.position(data);
		
	});

});





setInterval( function() {

	var pack = {
		player : Player.update(),
	}

	
	 for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		 
		 socket.emit('data',pack);
	}
	
	
},1);