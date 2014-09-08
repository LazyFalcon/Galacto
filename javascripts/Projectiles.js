/*
	co zosta³o do zrobienia?
	-rampage
	-bonusy
	-bronie(uzywana jest jedna, )
*/
var imgPath = 'img/';
var fps = 60;

var LEFT = 0;
var RIGHT = 1;
var UP = 2;
var DOWN = 3;
var SPACE = 4;
var io;

var player;

var explosionAnim;
var bonusImg;
var quit = false;



var bonuses = [
	{name: 'healing', 				time: 0, timeLeft:0, image: 0, addBonuses: function(obj){obj.hp += 100}, removeBonus: function(obj){}},
	{name: 'fasterShooting', 	time: 120, timeLeft:0, image: 0, addBonuses: function(obj){obj.cooldown}, removeBonus: function(obj){}},
	{name: 'shield', 					time: 60, timeLeft:0, image: 0, addBonuses: function(obj){obj.shield+=100}, removeBonus: function(obj){obj.shield = 0;}},
];

var LostGame = function(text){
	quit = true;
	io.addToGroup('GUI', new iio.Text(text,100,400)
						.setFont('58px Consolas')
						.setFillStyle('red'),20);
}

var dropBonus = function(x,y){
	var bonus = iio.getRandomInt(0,1);
	io.addToGroup('bonus',new iio.SimpleRect(x,y))
			.createWithImage(bonusImg)
			.enableKinematics()
			.setVel(0, 8)
			.setBound('bottom', io.canvas.height+120);
}

var spawnExplosion = function(x_,y_){
	var count = iio.getRandomInt(3,5);
	var range = 50;
	for(var i=0; i<count; i++){
		var x = iio.getRandomInt(x_ -range, x_ +range);
		var y = iio.getRandomInt(y_ -range, y_ +range);
		io.addToGroup('limitedLifetime',new iio.SimpleRect(x,y))
				.createWithAnim(explosionAnim.getSprite(0,6),'kaboom',0)
				.enableKinematics()
				.playAnim('kaboom', 20, io)
				.setLifetime(60/20*7);

	}
}

setBackground = function(){
	io.setBGColor('#0c0c0e');
	
}


function Projectile(){
	this.Projectile.apply(this, arguments);
}

	iio.inherit(Projectile, iio.SimpleRect);
	Projectile.prototype._super = iio.SimpleRect.prototype;
	Projectile.prototype.Projectile = function(x,y,damage){
		
		this._super.SimpleRect.call(this,x,y);
		this.dmg = damage;
	}

	
	
function Rocket(){
	this.Rocket.apply(this, arguments);
}

	iio.inherit(Rocket, iio.Rect);
	Rocket.prototype._super = iio.SimpleRect.prototype;
	Rocket.prototype.Rocket = function(x,y){
		
		this._super.Rect.call(this,x,y,10,10);
		var enemies = io.getGroup('enemy');
		this.velocity = 30;
		this.target = enemies[enemies.length-1];
		this.setVel(0,-30);
		this.enableKinematics();
		this.setBound('top', -40);
		
		
		
	}

		Rocket.prototype.updateSI = function(){
			this.setTorque(0.01);
		}




