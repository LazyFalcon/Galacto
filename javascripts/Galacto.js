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

var playerAnim = [imgPath+'playerLeft.png',
							imgPath+'player.png',
							imgPath+'playerRight.png'
		];
var enemyImagPath = [
	imgPath + 'enemy0.png',
	imgPath + 'enemy1.png',
	imgPath + 'enemy2.png',
	imgPath + 'enemy3.png',
	imgPath + 'enemy4.png',
];
var enemyImag = [];
var explosionAnim;
var bonusImg;

var enemyStats = [
	{name:'e0', hp:20, armour:5, dmg: 10, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
];
var projectiles = [
	{name:'Gatling', damage: 4, penetration: 10, range: 500, velocity:25, cooldown: 3, imgPath:imgPath+'gatling.png'},
	{name:'Plasma-Gun', damage: 20, penetration: 5, range: 700, velocity:16, cooldown: 8, imgPath:imgPath+'plasma.png'},
];
var enemyProjectiles = [
	{name:'Gatling', damage: 4, penetration: 10, range: 500, velocity:25, cooldown: 3, imgPath:imgPath+'gatling.png'},
	{name:'Plasma-Gun', damage: 20, penetration: 5, range: 700, velocity:16, cooldown: 8, imgPath:imgPath+'plasmaEnemy.png'},
];
var bonuses = [
	{name: 'healing', 				time: 0, timeLeft:0, image: 0, addBonuses: function(obj){obj.hp += 100}, removeBonus: function(obj){}},
	{name: 'fasterShooting', 	time: 120, timeLeft:0, image: 0, addBonuses: function(obj){obj.cooldown}, removeBonus: function(obj){}},
	{name: 'shield', 					time: 60, timeLeft:0, image: 0, addBonuses: function(obj){obj.shield+=100}, removeBonus: function(obj){obj.shield = 0;}},
];

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


//---------Player-------
function Player(){
	this.Player.apply(this, arguments);
}

	iio.inherit(Player, iio.SimpleRect);
	Player.prototype._super = iio.SimpleRect.prototype;
	Player.prototype.Player = function(x,y,newName){
		 
		//call parent constructor
		this._super.SimpleRect.call(this,x,y);
		
		this.createWithAnim(playerAnim,1);
		
		this.hp = 100;
		this.name = newName;
		this.speed = Math.round(8*60/fps); // px on sec
		this.input = [false, false, false, false, false];
		this.weaponCooldown = 0;
		this.ammo = 50;
		this.score = 13;
		this.ammoText = io.addToGroup('GUI', new iio.Text('Ammo: ',20,30)
						.setFont('18px Consolas')
						.setFillStyle('white'));
		this.hpText = io.addToGroup('GUI', new iio.Text('HP: '+this.hp,20,15)
						.setFont('18px Consolas')
						.setFillStyle('white'));
		this.scoreText = io.addToGroup('GUI', new iio.Text('Score: '+this.score,io.canvas.width - 200,15)
						.setFont('18px Consolas')
						.setFillStyle('white'));
		this.buff = null;
	}

	Player.prototype.getHit = function(damage){
		this.hp -= damage;
		this.hp = Math.max(this.hp, 0);
		this.hpText.setText('HP: '+this.hp);
	}

	Player.prototype.getPoints = function(points){
		this.score += points;
		this.score = Math.max(this.score, 0);
		this.scoreText.setText('Score: '+this.score);
	}

	Player.prototype.updateInput = function(event, boolValue){
			if(iio.keyCodeIs('a', event))
				this.input[LEFT] = boolValue;
			if(iio.keyCodeIs('d', event))
				this.input[RIGHT] = boolValue;
			if(iio.keyCodeIs('w', event))
				this.input[UP] = boolValue;
			if(iio.keyCodeIs('s', event))
				this.input[DOWN] = boolValue;
			if(iio.keyCodeIs('space', event))
				this.input[SPACE] = boolValue;
			event.preventDefault();
	}

	Player.prototype.updatePlayer = function(){
		
		//update position
		if (this.input[LEFT] && !this.input[RIGHT]
				&& this.pos.x - this.width/2> 0)
			this.translate(-this.speed,0); 
		if (this.input[RIGHT] && !this.input[LEFT]
				&& this.pos.x + this.width/2 < io.canvas.width)
			this.translate(this.speed,0); 
		if (this.input[UP] && !this.input[DOWN]
				&& this.pos.y - this.height/2 > 0)
			this.translate(0,-this.speed+1); 
		if (this.input[DOWN] && !this.input[UP]
				&& this.pos.y + this.height/2 < io.canvas.height)
			this.translate(0,this.speed-1);

		//update ship image
		if(this.input[LEFT] && !this.input[RIGHT])
			this.setAnimFrame(0);
		else if(this.input[RIGHT] && !this.input[LEFT])
			this.setAnimFrame(2);
		else this.setAnimFrame(1);
		
		if(this.input[SPACE] && this.weaponCooldown < 0 && this.ammo > 0){
			// this.ammo--;
				this.fire(this.left()+15, this.pos.y, 0.5);
				this.fire(this.right()-15, this.pos.y, -0.5);
			this.weaponCooldown = projectiles[1].cooldown;
		}
		else if(this.weaponCooldown > -1)
			this.weaponCooldown--;
		
		this.ammoText.setText('Ammo: '+this.ammo);
		if(this.buff != null){
			this.buff.time--;
			if(this.buff.time < 0){
				this.buff.removeBonus(this);
				this.buff = null;
			}
		}
		
	}

	Player.prototype.fire = function(x,y, mod){
		io.addToGroup('lasers', new Projectile(x,y, projectiles[1].damage),-1)
									.createWithImage(projectiles[1].image)
									.enableKinematics()
									.setBound('top',-40)
									.setVel(mod,-projectiles[1].velocity);
		
	}
//---------Enemy-------
function Enemy(){
	this.Enemy.apply(this, arguments);
}
	iio.inherit(Enemy, iio.SimpleRect);

	Enemy.prototype._super = iio.SimpleRect.prototype;
	Enemy.prototype.Enemy = function(x,y, type){
		this._super.SimpleRect.call(this,x,y);

		this.hp = enemyStats[type].hp;
		
		this.enableKinematics();
		this.setBound('bottom', io.canvas.height+120);
		this.createWithImage(enemyImag[type]);
		this.setVel(0,iio.getRandomInt(5,8));
		this.dodge = false;
		this.weaponCooldown = 0;
	}
	Enemy.prototype.updateSI = function(){
		this.weaponCooldown = Math.max(this.weaponCooldown-1,0);
		if(Math.abs(this.pos.x - player.pos.x) < 100){
			if(!this.dodge)
				this.setVel(iio.getRandomInt(-6,6),iio.getRandomInt(3,5));
			this.dodge = true;
		}
		else if(this.dodge){
			this.setVel(0,iio.getRandomInt(5,8));
			this.dodge = false;
		}
		if(Math.abs(this.pos.x - player.pos.x) < 250 && this.weaponCooldown < 0){
			this.fire(this.left()+15, this.pos.y);
			this.fire(this.right()-15, this.pos.y);
			this.weaponCooldown = enemyProjectiles[1].cooldown;
		}
			
	}
	Enemy.prototype.fire = function(x,y){
		io.addToGroup('lasers', new Projectile(x,y, enemyProjectiles[1].damage),-1)
									.createWithImage(enemyProjectiles[1].image)
									.enableKinematics()
									.setBound('bottom',+40)
									.setVel(0, enemyProjectiles[1].velocity);
	}
function main(IO){
	io = IO;
	var rampage = 0;
	var scrapImage = new Image();
	scrapImage.src = imgPath+'enemyScrap.png';
	var scrapAnim = new iio.SpriteMap(scrapImage,140,140);
	
	var laserFlashImg = new Image();
	laserFlashImg.src = imgPath+'laserRedShot.png';
	var image90 = new Image();
	image90.src = imgPath+'explosion.png';
	explosionAnim = new iio.SpriteMap(image90,100,100);
	
	bonusImg = new Image();
	bonusImg.src = imgPath+'bonus.png';
	// io.activateDebugger();
	
	for(i=0; i<enemyImagPath.length; i++){
		enemyImag[i] = new Image();
		enemyImag[i].src = enemyImagPath[i];
		
	}
	for(i=0; i<projectiles.length; i++){
		projectiles[i].image = new Image();
		projectiles[i].image.src = projectiles[i].imgPath;
	}
	for(i=0; i<enemyProjectiles.length; i++){
		enemyProjectiles[i].image = new Image();
		enemyProjectiles[i].image.src = enemyProjectiles[i].imgPath;
	}

	
	io.addGroup('lasers');
	io.addGroup('player');
	io.addGroup('enemy');
	io.addGroup('bonus');
	setBackground();
	player = io.addToGroup('player', new Player(io.canvas.center.x, io.canvas.height-100, 'Dez'));


 	window.addEventListener('keydown', function(event){
		player.updateInput(event, true);

		// check for pause
		if(iio.keyCodeIs('pause', event) || iio.keyCodeIs('p', event))
					io.pauseFramerate();
	});
	window.addEventListener('keyup', function(event){
		player.updateInput(event, false);
	});
	

	
	io.setCollisionCallback('lasers', 'enemy', function(laser, enemy){
		player.getPoints(14);
		enemy.hp -= laser.dmg;
		
		io.addToGroup('flashes'
		,new iio.SimpleRect((laser.pos.x+enemy.pos.x)/2
							 ,(laser.pos.y+enemy.pos.y)/2),10)
				.createWithImage(laserFlashImg)
				.enableKinematics()
				.setVel(enemy.vel.x, enemy.vel.y)
				.shrink(.1);
		
		io.rmvFromGroup(laser, 'lasers');
		if (enemy.hp < 0){
				dropBonus(enemy.pos.x, enemy.pos.y);
				spawnExplosion(enemy.pos.x, enemy.pos.y);
				rampage+=5;
				io.addToGroup('limitedLifetime', new iio.SimpleRect(enemy.pos))
					.enableKinematics()
					.setBound('bottom', io.canvas.height+120)
					// .createWithImage(scrapImage)
					.createWithAnim(scrapAnim.getSprite(0,5),'scrap',0)
					.playAnim('scrap', 10, io)
					.setLifetime(60/10*6)
					.setVel(0, enemy.vel.y);
				
				io.rmvFromGroup(enemy, 'enemy');
		}
	});
	io.setCollisionCallback('player', 'enemy', function(player_, enemy){
		enemy.hp -= 100;
		player_.getHit(100);
		if (enemy.hp < 0){
				io.rmvFromGroup(enemy, 'enemy');
		}
		if (player_.hp < 0){
			// delete player.owner.handle;
			// delete player.owner;
				// io.rmvFromGroup(player, 'player');
		}
	});
	io.setCollisionCallback('player', 'bonus', function(player_, bonus){
			
			io.rmvFromGroup(bonus, 'bonus');
	});
	
	
	
	rampageText = io.addToGroup('GUI', new iio.Text('Rampage: '+rampage,200,30)
						.setFont('18px Consolas')
						.setFillStyle('white'));
						
						
	var timer = 200;
	var release = iio.getRandomInt(7,1);
	io.setFramerate(60, function(){
			if(rampage >= 100){
				
			}
			else{
				rampage = Math.max(0, rampage - 0.05);
				rampageText.setText('Rampage: '+Math.round(rampage)+'%');
			}
			player.updatePlayer();
			var enemies = io.getGroup('enemy');
			var enemyCount = enemies.length;
			for(var i=0; i<enemyCount; i++){
				enemies[i].updateSI();
			}
			
			timer++;
			
			if(timer > release){
				timer = 0;
				release = iio.getRandomInt(30,50);
				var x = iio.getRandomInt(30,io.canvas.width-30);
				var y = iio.getRandomInt(-50,-100);
					io.addToGroup('enemy', new Enemy(x,y,iio.getRandomInt(0,4)));
					// .setBounds(null, io.canvas.width-50, null, 50, function(obj){
						// obj.vel.x = 0;
						// return true;
					// });
					// io.addToGroup('enemy', new Enemy(x,y,1));
				}
	});
}


