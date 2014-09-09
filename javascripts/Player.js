var LEFT = 0;
var RIGHT = 1;
var UP = 2;
var DOWN = 3;
var SPACE = 4;
var ROCKET = 5;

var projectiles = [
	{name:'Gatling', 		ammo: '∞', damage: 4, penetration: 10, range: 500, velocity:25, cooldown: 3},
	{name:'Plasma-Gun', ammo: '∞', damage: 20, penetration: 5, range: 700, velocity:16, cooldown: 8},
	{name:'Plasma-Gun Imprv', ammo: 50, damage: 35, penetration: 5, range: 650, velocity:16, cooldown: 6},
	{name:'emp', 				ammo: 80, damage: 50, penetration: 5, range: 487, velocity:10, cooldown: 12},
	{name:'Kinetic Sand', 		ammo: 80, damage: 3, penetration: 5, range: 487, velocity:40, cooldown: 12},
];

projectiles[0].fire = function(obj){
		io.addToGroup('lasers', new Projectile(obj.pos.x,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range)
		.setVel(0,-this.velocity);
	return false;
}
projectiles[1].fire = function(obj){
	io.addToGroup('lasers', new Projectile(obj.left()+15,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range)
		.setVel(0.5,-this.velocity);
		
	io.addToGroup('lasers', new Projectile(obj.right()-15,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range)
		.setVel(-0.5,-this.velocity);
		
	return false;
}
projectiles[2].fire = function(obj){

	if(this.ammo<=0)
		return true;
	this.ammo--;
	io.addToGroup('lasers', new Projectile(obj.left()+15,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range)
		.setVel(0.5,-this.velocity);
		
	io.addToGroup('lasers', new Projectile(obj.right()-15,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range)
		.setVel(-0.5,-this.velocity);
		
	return false;
}
projectiles[3].fire = function(obj){
	if(this.ammo<=0)
		return true;
	this.ammo--;
	io.addToGroup('lasers', new Projectile(obj.pos.x,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range)
		.setVel(0,-this.velocity);
		
		
	return false;
}
projectiles[4].fire = function(obj){
	if(this.ammo<=0)
		return true;
	this.ammo--;
	var count = 20;
	for(var i=0; i<count; i++){
		var angle = -0.35+0.035*i;
		io.addToGroup('lasers', new Projectile(obj.pos.x,obj.pos.y-10, this.damage),-1)
		.createWithImage(this.image)
		.enableKinematics()
		.setBound('top', obj.pos.y - this.range*Math.cos(angle))
		.setVel(Math.sin (angle)*this.velocity,-Math.cos(angle)*this.velocity*iio.getRandomNum(0.9,1.1));
		
	}
	return false;
}
	
var rockets = [
	{name:'Rocket', 		ammo: 12, damage: 200, penetration: 5, range: 700, velocity:16, cooldown: 8, imagPath:imgPath+'rocket.png'},
	{name:'AtomicRocket', 		ammo: 1, damage: 200, penetration: 5, range: 700, velocity:16, cooldown: 8, imagPath:imgPath+'rocket.png'},
];	

var bonuses = [
	{name: 'Healing', text:'Hp +100', image: null, image: 0, useBonus: function(obj){obj.hp += 100}},
	{name: 'Healing', text:'♥++', image: null, image: 0, useBonus: function(obj){obj.lives ++; obj.calcLives(); }},
	{name: 'Shield', text:'Shield +100', image: null, image: 0, useBonus: function(obj){obj.shield+=100}},
	{name: 'PGIAmmo', text:'Plasma +50', image: null, image: 0, useBonus: function(obj){projectiles[2].ammo += 50;}},
	{name: 'EMPAmmo', text:'EMP +20', image: null, image: 0, useBonus: function(obj){projectiles[3].ammo += 20;}},
	{name: 'SandAmmo', text:'Kinetic +25', image: null, image: 0, useBonus: function(obj){projectiles[4].ammo += 25;}},
	{name: 'RocketsAmmo', text:'Rockets +5', image: null, image: 0, useBonus: function(obj){rockets[0].ammo += 5;}},
	{name: 'AtomicsRocketsAmmo', text:'☢ة ت ث  ج   ر حز ذخ دس☢', image: null, image: 0, useBonus: function(obj){rockets[1].ammo += 50;}},
];

var dropBonus = function(x,y){
	var bonus = iio.getRandomInt(0,bonuses.length);
	var tmp = io.addToGroup('bonus',new iio.SimpleRect(x,y))
			.createWithImage(bonuses[bonus].image)
			.enableKinematics()
			.setVel(0, 4)
			.setBound('bottom', io.canvas.height+120);
	tmp.id = bonus;
}

var playerAnim = [imgPath+'playerLeft.png',
							imgPath+'player.png',
							imgPath+'playerRight.png'
		];
		
function Player(){
	this.Player.apply(this, arguments);
}

	iio.inherit(Player, iio.SimpleRect);
	Player.prototype._super = iio.SimpleRect.prototype;
	Player.prototype.Player = function(x,y,newName){
		 
		//call parent constructor
		this._super.SimpleRect.call(this,x,y);
		
		this.createWithAnim(playerAnim,1);
		this.enableKinematics(function(){this.updatePlayer(); return true;});
		
		this.hp = 100;
		this.name = newName;
		this.speed = Math.round(8*60/fps); // px on sec
		this.input = [false, false, false, false, false];
		this.weaponID = 0;
		this.weaponCooldown = 0;
		this.rocketCooldown = 0;
		this.ammo = projectiles[0].ammo;
		this.score = 13;
		this.cooldownStr = '';
		this.ammoText = io.addToGroup('GUI', new iio.Text('Ammo: ',20,30)
						.setFont('18px Impact')
						.setFillStyle('white'));
		this.hpText = io.addToGroup('GUI', new iio.Text('HP: '+this.hp,20,15)
						.setFont('18px Impact')
						.setFillStyle('red'));
		this.lives = 3;
		// this.livesText = io.addToGroup('GUI', new iio.Text('♥: '+this.lives,100,15)
		this.livesText = io.addToGroup('GUI', new iio.Text('♥♥♥',100,15)
						.setFont('18px Impact')
						.setFillStyle('red'));
						
		this.calcLives();
		this.scoreText = io.addToGroup('GUI', new iio.Text('Score: '+this.score,io.canvas.width - 20,15)
						.setFont('18px Impact')
						.setTextAlign('right')
						.setFillStyle('yellow'));
		this.weapText = io.addToGroup('GUI', new iio.Text('--- ',20, io.canvas.height-5)
						.setFont('18px Impact')
						.setFillStyle('white'));
		
		this.shield = 100;
		this.shieldText = io.addToGroup('GUI', new iio.Text('Shield: '+this.shield+'%',20,45)
						.setFont('18px Impact')
						.setFillStyle('blue'));
	}
	
	Player.prototype.calcLives = function(){
			var slives='';
			for(var i=0; i< this.lives; i++)
				slives += '♥';
			this.livesText.setText(slives);
	}
	Player.prototype.getHit = function(damage){
		if(this.shield > 0){
			this.shield -= damage/3;
			this.shieldText.setText('Shield: '+Math.round(this.shield)+'%');
			damage -= damage*this.shield/100;
		}
		// else {
		this.hp -= damage;
		this.hp = Math.max(this.hp, 0);
		if(this.hp == 0){
			this.hp = 100;
			this.lives--;
			
			this.calcLives();
			if(this.lives == 0){
				this.livesText.setText('☠☠☠');
				LostGame('☠ur noob!!! lolz!!☠');
			}
		}
		this.hpText.setText('HP: '+Math.round(this.hp));
		// }
	}

	Player.prototype.getPoints = function(points){
		this.score += points;
		this.score = Math.max(this.score, 0);
		this.scoreText.setText('Score: '+this.score);
	}

	Player.prototype.switchWeapon = function(id){
		// projectiles[this.weaponID].ammo = this.ammo;
		this.weaponID = id;
		// this.ammo = projectiles[id].ammo;
		// this.weaponCooldown = projectiles[id].cooldown;
		this.weapText.setText('ᐊ '+projectiles[id].name+' ᐅ');
		this.ammoText.setText('Ammo: '+projectiles[this.weaponID].ammo);
	}
	
	Player.prototype.updateInput = function(event, boolValue){
			if(iio.keyCodeIs('a', event)){
				this.input[LEFT] = boolValue;
				event.preventDefault();
			}
			else if(iio.keyCodeIs('d', event)){
				this.input[RIGHT] = boolValue;
				event.preventDefault();
			}
			else if(iio.keyCodeIs('w', event)){
				this.input[UP] = boolValue;
				event.preventDefault();
			}
			else if(iio.keyCodeIs('s', event)){
				this.input[DOWN] = boolValue;
				event.preventDefault();
			}
			else if(iio.keyCodeIs('space', event)){
				this.input[SPACE] = boolValue;
				event.preventDefault();
			}
			else if(iio.keyCodeIs('1', event)){
				this.switchWeapon(0);
				event.preventDefault();
			}
			else if(iio.keyCodeIs('2', event)){
				this.switchWeapon(1);
				event.preventDefault();
			}
			else if(iio.keyCodeIs('3', event)){
				this.switchWeapon(2);
				event.preventDefault();
			}
			else if(iio.keyCodeIs('4', event)){
				this.switchWeapon(3);
				event.preventDefault();
			}
			else if(iio.keyCodeIs('5', event)){
				this.switchWeapon(4);
				event.preventDefault();
			}
			else if(iio.keyCodeIs('c', event)){
				this.input[ROCKET] = boolValue;
				event.preventDefault();
			}
	}

	Player.prototype.updatePlayer = function(){
		// console.log('!');
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
		
		// if(this.input[SPACE] && this.weaponCooldown <= 0 && (this.ammo > 0 || this.ammo == '∞')){
			// if(this.ammo != '∞')
				// this.ammo--;
			// this.fire(this.left()+15, this.pos.y, 0.5);
			// this.fire(this.right()-15, this.pos.y, -0.5);
			// this.weaponCooldown = projectiles[this.weaponID].cooldown;
		// }
		this.fire();
		
		this.shield = Math.max( Math.min(this.shield+0.1, 100) , 0);
		this.shieldText.setText('shield: '+Math.round(this.shield)+'%');
	}

	Player.prototype.fire = function(){
		if(this.input[SPACE] && this.weaponCooldown <= 0){
			projectiles[this.weaponID].fire(this);
			this.cooldownStr = ' ☢'
			this.ammoText.setText('Ammo: '+projectiles[this.weaponID].ammo + this.cooldownStr);
			this.weaponCooldown = projectiles[this.weaponID].cooldown;
		}
			
		if(this.input[ROCKET] && this.rocketCooldown <=0){
			this.spawnRocket();
			this.rocketCooldown = 25;
		}
		if(this.weaponCooldown > 0){
			this.weaponCooldown = Math.max(this.weaponCooldown-1, 0);
		}
		else{
			this.cooldownStr = '';
			this.ammoText.setText('Ammo: '+projectiles[this.weaponID].ammo + this.cooldownStr);
		}
			
		this.rocketCooldown = Math.max(this.rocketCooldown-1, 0);
	}
	
	Player.prototype.spawnRocket = function(){
		io.addToGroup('rockets', new Rocket(this.pos.x, this.pos.y-10))
				.createWithImage(rockets[0].image);
	}
	
	