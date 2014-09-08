var enemyProjectiles = [
	{name:'Gatling', damage: 4, penetration: 10, range: 500, velocity:25, cooldown: 13, imgPath:imgPath+'gatling.png'},
	{name:'Plasma-Gun', damage: 15, penetration: 5, range: 700, velocity:16, cooldown: 28, imgPath:imgPath+'plasmaEnemy.png'},
];


var enemyImagPath = [
	imgPath + 'enemy0.png',
	imgPath + 'enemy1.png',
	imgPath + 'enemy2.png',
	imgPath + 'enemy3.png',
	imgPath + 'enemy4.png',
];
var enemyImag = [];

var enemyStats = [
	{name:'e0', hp:20, armour:5, dmg: 10, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:90, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
	{name:'e1', hp:30, armour:6, dmg: 15, pen: 11,  },
];


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
		// if(Math.abs(this.pos.x - player.pos.x) < iio.getRandomInt(100,250) && this.weaponCooldown <= 0){
		if(Math.abs(this.pos.x - player.pos.x) < 200 && this.weaponCooldown <= 0){
			this.fire(this.left()+15, this.pos.y+25);
			this.fire(this.right()-15, this.pos.y+25);
			this.weaponCooldown = enemyProjectiles[1].cooldown;
		}
			
	}
	
	Enemy.prototype.fire = function(x,y){
		io.addToGroup('elasers', new Projectile(x,y, enemyProjectiles[1].damage),-1)
									.createWithImage(enemyProjectiles[1].image)
									.enableKinematics()
									.setBound('bottom',io.canvas.height+40)
									.setVel(0, enemyProjectiles[1].velocity+this.vel.y);
	}

