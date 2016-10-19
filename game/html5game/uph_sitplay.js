var socket;

var Player = function(data){

	var self = {
		id :data.id,
		x:data.x,
		y:data.y,
		sprite_index:data.sprite_index
	
	}
	
	Player.list[self.id]=self;
}

Player.list={};


var io_init = function(url)
{
 
	if (typeof url != 'undefined'){ 
		socket=io(url); 
	}else{ 
		socket=io();
	}
	 
	socket.on('connect',function(){
	
			socket.emit('id',true,function(id){
				socket.id = id; //get socket.id on server 
			});
			
	});
	
	socket.on('data',function(data){
		
		if ( socket.id > 0 ) {
		
		 for(var i=0; i < data.player.length; i++){
			 var  player = data.player[i];		
		 
				Player(player); 
		 }

		}	
	});
	
};


var sitplay_data = function(func){

	 if ( func === 'socket.id' ) return socket.id ;
	 
	 if ( func === 'player.position' ) {
		var json =  JSON.stringify(Player.list);
		Player.list={}; //clear data 
		return json;
	 }

}



function sitplay_player_position(data)
{
	var player = JSON.parse(data);	
	player.id = socket.id;
	socket.emit('position',player);
	
}

