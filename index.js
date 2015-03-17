var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/online_snake_battle.html');
});
app.get('/snakeAndFood.js', function (req, res) {
  res.sendfile(__dirname + '/snakeAndFood.js');
});

var rooms = {};  //rooms对象，存储房间号及人数。{idOfCreater: numOfPeople, ...}
var dir = [4, 3]; //初始方向

io.on('connection', function (socket) {
	/*给蛇分配房间，区分snake1，2 ************************/
	var flag = true;  //判断是否需要建新的room
	for (id in rooms) {  //遍历对象的属性
		if (rooms[id] == 1) {
			socket.join(id);
			rooms[id]++;
			io.to(id).emit('start', 0);  //给特定房间发
			flag = false;
			console.log('going to ' + id);
		}
	}
	if (flag) {
		rooms[socket.id] = 1;
		socket.join(socket.id);
		console.log('creating ' + socket.id);
		io.to(socket.id).emit('snake1');
	}
	console.log(rooms);
	///////////////////////////////////////////////////////

	/*收到方向改变信息，根据房间名判断哪条蛇变化，然后将两条蛇的信息作为数组广播回去****************************************/
	socket.on('dir', function(data) {
		console.log(socket.id);
		console.log(socket.rooms[1]); //不知道为什么？？？rooms第一位包含自己。。
		console.log('dir is ' + data);
		if (socket.id == socket.rooms[1]) {  //snake1 发送dir过来(房间创建者是snake1)
			dir[0] = data;  //更新dir数组
 		}
 		else {
 			dir[1] = data;
 		}
 		console.log(dir);
 		io.to(socket.rooms[1]).emit('dir', dir);  //向本room发送dir数组
	});

});