var enemyProjectiles = [
	{name:'ePlasma-Gun', damage: 15, penetration: 5, range: 700, velocity:16, cooldown: 28},
];



var enemyStats = [
	{name:'e0', hp:20, armour:5, dmg: 10, pen: 11, image: null },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11, image: null },
	{name:'e2', hp:90, armour:6, dmg: 15, pen: 11, image: null },
	{name:'e3', hp:30, armour:6, dmg: 55, pen: 11, image: null },
	{name:'e4', hp:30, armour:6, dmg: 25, pen: 11, image: null },
	{name:'e5', hp:30, armour:6, dmg: 25, pen: 11, image: null },
];

var enemyBossStats = [
	{name:'e0', hp:202, armour:5, dmg: 10, pen: 11,  fire: function(obj){}  },
	{name:'e1', hp:305, armour:6, dmg: 15, pen: 11,  fire: function(obj){}  },
	{name:'e1', hp:540, armour:6, dmg: 15, pen: 11,  fire: function(obj){}  },
	{name:'e1', hp:100, armour:16, dmg: 55, pen: 11,  fire: function(obj){}  },
	{name:'e1', hp:150, armour:6, dmg: 25, pen: 11,  fire: function(obj){}  },
	{name:'e1', hp:150, armour:6, dmg: 25, pen: 11,  fire: function(obj){}  },
];


function Enemy(){
	this.Enemy.apply(this, arguments);
}
	iio.inherit(Enemy, iio.SimpleRect);

	Enemy.prototype._super = iio.SimpleRect.prototype;
	
	Enemy.prototype.Enemy = function(x,y, type){
		this._super.SimpleRect.call(this,x,y);

		this.hp = enemyStats[type].hp;
		
		this.enableKinematics(function(){this.updateSI(); return true;});
		this.setBound('bottom', io.canvas.height+120);
		this.createWithImage(enemyStats[type].image);
		this.setVel(0,iio.getRandomInt(5,8));
		this.dodge = false;
		this.weaponCooldown = 0;
	}
	
	Enemy.prototype.updateSI = function(){
		// console.log(this.pos.x);
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
		// if(Math.abs(this.pos.x - player.pos.x) < iio.getRandomInt(100,250) && this.weaponCooldown <= 0){
		if(Math.abs(this.pos.x - player.pos.x) < 200 && this.weaponCooldown <= 0){
			this.fire(this.left()+15, this.pos.y+25);
			this.fire(this.right()-15, this.pos.y+25);
			this.weaponCooldown = enemyProjectiles[0].cooldown;
		}
			
	}
	
	Enemy.prototype.fire = function(x,y){
		io.addToGroup('elasers', new Projectile(x,y, enemyProjectiles[0].damage),-1)
									.createWithImage(enemyProjectiles[0].image)
									.enableKinematics()
									.setBound('bottom',io.canvas.height+40)
									.setVel(0, enemyProjectiles[0].velocity+this.vel.y);
	}

function Boss(){
	this.Boss.apply(this, arguments);
}
	iio.inherit(Boss, iio.SimpleRect);

	Boss.prototype._super = iio.SimpleRect.prototype;
	
	Boss.prototype.Boss = function(x,y, type){
		this._super.SimpleRect.call(this,x,y);

		this.hp = enemyStats[type].hp;
		
		this.enableKinematics(function(){this.updateSI(); return true;});
		this.setBound('bottom', io.canvas.height+120);
		// this.setBound('right', io.canvas.width-50,function(obj){obj.vel.x = -3; return true});
		// this.setBound('left', 50,function(obj){obj.vel.x = 3; return true});
		// this.setBound('right', io.canvas.width-50);
		// this.setBound('left', 50);
		this.createWithImage(enemyImag[type]);
		this.setVel(0,iio.getRandomInt(5,8));
		this.dodge = false;
		this.weaponCooldown = 0;
	}
	
	Boss.prototype.updateSI = function(){
		// console.log(this.pos.x);
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
		// if(Math.abs(this.pos.x - player.pos.x) < iio.getRandomInt(100,250) && this.weaponCooldown <= 0){
		if(Math.abs(this.pos.x - player.pos.x) < 200 && this.weaponCooldown <= 0){
			this.fire(this.left()+15, this.pos.y+25);
			this.fire(this.right()-15, this.pos.y+25);
			this.weaponCooldown = enemyProjectiles[0].cooldown;
		}
			
	}
	
	Boss.prototype.fire = function(x,y){
		io.addToGroup('elasers', new Projectile(x,y, enemyProjectiles[0].damage),-1)
									.createWithImage(enemyProjectiles[0].image)
									.enableKinematics()
									.setBound('bottom',io.canvas.height+40)
									.setVel(0, enemyProjectiles[0].velocity+this.vel.y);
	}

