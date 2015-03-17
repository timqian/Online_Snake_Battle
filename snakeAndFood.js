/*'===' 是什么个意思？
在if内部定义变量好不好？(22行)
Snake.nextP = 。。。与Snake.prototype.nextP 效果有何不同？与food的不同之处
似乎只有纯数字构成的array可以比较(不能有字符串，对象等)(经chrome console 测试)
js数组是否有查找自身的函数？如果没有，可以写一个，在这里可以减少代码。。
*/
/****************************define Snake and Food object and update them******/
var w = 30, h = 30;

//在坐标array中找出特定点
Array.prototype.find = function (point) {
	for (var i = this.length - 1; i >= 0; i--) {
		if (point.x === this[i].x && point.y === this[i].y)
			return i;
	};
	return -1;
}

var food = [{x:h/2, y:h/2}];
food.update = function(){  //待改进(没有考虑生成食物在蛇身上！)
	if (this.length === 0) {
		food[0] = {x: parseInt(Math.random() * w, 10), y: parseInt(Math.random() * h, 10)}; //测试表明： 不能给food赋予数组类型的值，这样会使food的函数消失。。
	}
	else {}
};

function Snake (dir, body) {
	this.dir = dir;   //1,2,3,4代表上下左右
	this.body = body;  //Array of coordinates
}
Snake.prototype.nextP = function() {   //calculate next point with 循环边界条件
	if (this.body[0]) {   //蛇身体长度不为0时
		switch (this.dir) { 
			case 1:
			  return { x: this.body[0].x,  y: (this.body[0].y-1 >= 0)?(this.body[0].y-1):(h-1) };   //注意返回的对象格式{x:8,y:9}
			  break;
			case 2:
			  return { x: this.body[0].x,  y: (this.body[0].y+1 < h)?(this.body[0].y+1):(0) };
			  break;
			case 3:
			  return { x: (this.body[0].x-1 >= 0)?(this.body[0].x-1):(w-1),  y: this.body[0].y };
			  break;
			case 4:
			  return { x: (this.body[0].x+1 < w)?(this.body[0].x+1):(0),     y: this.body[0].y };
			  break;
		}
	}
	else {
		alert('head cut');
	}
};


var snake1 = new Snake(4, [{x:5, y:h/2},{x:4, y:h/2},{x:3, y:h/2},{x:2, y:h/2},{x:1, y:h/2},{x:0, y:h/2}]);
var snake2 = new Snake(3, [{x:w, y:h/2}]);

var nextP1 = snake1.nextP();  //snake1下一步要到达的坐标
var nextP2 = snake2.nextP();

function update () {
	//添头
	snake1.body.unshift(nextP1);
	snake2.body.unshift(nextP2);

	//检查 nextP1 是否咬到 snake2;     
	//如果咬到: 1. snake2.body被切割; 2. 食物Array增加;
	var k = snake2.body.find(nextP1);
	if (k != -1) {
		food = food.concat( snake2.body.splice(k, 100) );  //从数组编号为 k 处开始删掉 100 个元素; concat() 将切下来的数组连接到food
		//snake1.body.push(lastP1);
	}

	var l = snake1.body.find(nextP2);
	if (l != -1) {
		food = food.concat( snake1.body.splice(l, 100) );  //从数组编号为 k 处开始删掉 100 个元素; concat() 将切下来的数组连接到food
		//snake2.body.push(lastP2);
	}

	//检查 snake1 是否吃到食物;
	//如果吃到 1. 去掉该粒食物， 2. 蛇不去尾
	var i = food.find(nextP1);
	if ( i != -1) {
		food.splice(i, 1);  //从数组编号为 i 处开始删掉 1 个元素(删除第i个元素)
	} else {
		snake1.body.pop();  //snake1去尾
	}

	var j = food.find(nextP2);
	if ( j != -1) {
		food.splice(j, 1);  //从数组编号为 i 处开始删掉 1 个元素(删除第i个元素)
	} else {
		snake2.body.pop();  //snake2去尾
	}

	//food.update();
	if (food.length === 0) {
		food[0] = {x: parseInt(Math.random() * w, 10), y: parseInt(Math.random() * h, 10)}; //测试表明： 不能给food赋予数组类型的值，这样会使food的函数消失。。
	}

	//update next points
	nextP1 = snake1.nextP();
	nextP2 = snake2.nextP();	
}
////////////////////////////////////////////////////////////////////////////////
