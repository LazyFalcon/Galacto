/*
	co zosta�o do zrobienia?
	-rampage
	-bonusy
	-bronie(uzywana jest jedna, )
*/
var collection328 =' ☢ ☣ ♠ ♣ ♥ ♦ ♧ ♨ ♩ ♪ ♫ ♬ | ᚠ ᚡ ᚢ ᚣ ᚤ ᚥ ᚦ ᚧ ᚨ ᚩ ᚪ ᚫ ᚬ ᚭ ᚮ ᚯ ᚰ ᚱ ᚲ ᚳ ᚴ ᚵ ᚶ ᚷ ᚸ ᚹ ᚺ ᚻ ᚼ ᚽ ᚾ ᚿ | ↺ ↻ ∞ ➠ ➡ ➢ ➣ ➤ ➥ ➦ ➧ ➨ ➩ ➪ ➫ ➬ ➭ ➮ ➯ ➰ ➱ ➲ ➳ ➴ ➵ ➶ ➷ ➸ ➹ ➺ ➻ ➼ ➽ ➾   ✉ ✠ ✡ ✢ ✣ ✤ ✥ ✦ ✧ ✨ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ✱ ✲ ✳ ✴ ✵ ✶ ✷ ✸ ✹ ✺ ✻ ✼ ✽ ✾ ✿ ';

var imgPath = 'img/';
var fps = 60;
var io;

var player;

var explosionAnim;
var bonusImg;
var quit = false;





var LostGame = function(text){
	quit = true;
	io.addToGroup('GUI', new iio.Text(text,io.canvas.width/2,io.canvas.height/2)
						.setFont('58px Consolas')
						.setTextAlign('center')
						.setFillStyle('red'),-20);
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
	Rocket.prototype._super = iio.Rect.prototype;
	Rocket.prototype.Rocket = function(x,y){
		
		this._super.Rect.call(this,x,y,10,10);
		
		var enemies = io.getGroup('enemy');
		this.velocity = 10;
		this.target = null;
		if(enemies.length > 0)
			this.target = enemies[enemies.length-1];
	
		this.enableKinematics(function(){return this.updateSI();});
		this.setVel(0,-this.velocity);
		this.setBounds(-40, io.canvas.width+40, io.canvas.height+40, -40);
		this.cooldown = 3;
		
	}

	Rocket.prototype.updateSI = function(){
		this.cooldown = Math.max(this.cooldown-1, 0);
		if(this.target == null && io.getGroup('enemy').length > 0)
			this.target = io.getGroup('enemy')[io.getGroup('enemy').length-1];
			
		if(this.cooldown == 0){
			var angle = Math.atan2(this.target.pos.x - this.pos.x-40, this.pos.y-this.target.pos.y);
			this.rotation = angle;
			this.setVel(Math.sin(this.rotation)*this.velocity,-Math.cos(this.rotation)*this.velocity);
			
			if(this.pos.distance(this.target.pos) < 70){
				this.explode();
				return false;
			}
		}
		return true;
	}
	
	Rocket.prototype.explode = function(){
		io.addToGroup('explosion',new iio.SimpleRect(this.pos.x,this.pos.y,75)
				.createWithAnim(explosionAnim.getSprite(0,6),'kaboom',0)
				.enableKinematics()
				.playAnim('kaboom', 20, io)
				.setLifetime(60/20*7));
	}




