
var projectiles = [
	{name:'Gatling', damage: 4, penetration: 10, range: 500, velocity:25, cooldown: 3, imgPath:imgPath+'gatling.png'},
	{name:'Plasma-Gun', damage: 20, penetration: 5, range: 700, velocity:16, cooldown: 8, imgPath:imgPath+'plasma.png'},
	{name:'Plasma-Gun', damage: 20, penetration: 5, range: 700, velocity:16, cooldown: 8, imgPath:imgPath+'plasma.png'},
	{name:'Plasma-Gun', damage: 20, penetration: 5, range: 700, velocity:16, cooldown: 8, imgPath:imgPath+'plasma.png'},
	{name:'Rocket', damage: 200, penetration: 5, range: 700, velocity:16, cooldown: 8, imgPath:imgPath+'rocket.png'},
];

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
		
		this.hp = 100;
		this.name = newName;
		this.speed = Math.round(8*60/fps); // px on sec
		this.input = [false, false, false, false, false];
		this.weaponID = 0;
		this.weaponCooldown = 0;
		this.ammo = 50;
		this.score = 13;
		this.ammoText = io.addToGroup('GUI', new iio.Text('Ammo: ',20,30)
						.setFont('18px Consolas')
						.setFillStyle('white'));
		this.hpText = io.addToGroup('GUI', new iio.Text('HP: '+this.hp,20,15)
						.setFont('18px Consolas')
						.setFillStyle('red'));
		this.lives = 3;
		this.livesText = io.addToGroup('GUI', new iio.Text('<3: '+this.lives,100,15)
						.setFont('18px Consolas')
						.setFillStyle('green'));
		this.scoreText = io.addToGroup('GUI', new iio.Text('Score: '+this.score,io.canvas.width - 20,15)
						.setFont('18px Consolas')
						.setTextAlign('right')
						.setFillStyle('yellow'));
		this.buff = null;
		
		this.shield = 100;
		this.shieldText = io.addToGroup('GUI', new iio.Text('shield: '+this.shield+'%',20,45)
						.setFont('18px Consolas')
						.setFillStyle('blue'));
	}

	Player.prototype.getHit = function(damage){
		if(this.shield > 0){
			this.shield -= damage/3;
			this.shieldText.setText('shield: '+Math.round(this.shield)+'%');
			damage -= damage*this.shield/100;
		}
		// else {
		this.hp -= damage;
		this.hp = Math.max(this.hp, 0);
		if(this.hp == 0){
			this.hp = 100;
			this.lives--;
			this.livesText.setText('<3: '+this.lives);
			if(this.lives == 0)
				LostGame('ur noob!!! lolz!!');
		}
		this.hpText.setText('HP: '+Math.round(this.hp));
		// }
	}

	Player.prototype.getPoints = function(points){
		this.score += points;
		this.score = Math.max(this.score, 0);
		this.scoreText.setText('Score: '+this.score);
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
				this.weaponID = 0;
			event.preventDefault();
			}
			else if(iio.keyCodeIs('2', event)){
				this.weaponID = 1;
			event.preventDefault();
			}
			else if(iio.keyCodeIs('3', event)){
				this.weaponID = 2;
			event.preventDefault();
			}
			else if(iio.keyCodeIs('4', event)){
				this.weaponID = 3;
			event.preventDefault();
			}
			else if(iio.keyCodeIs('c', event)){
				this.spawnRocket();
			event.preventDefault();
			}
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
			this.weaponCooldown = projectiles[this.weaponID].cooldown;
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
		
		this.shield = Math.max( Math.min(this.shield+0.1, 100) , 0);
		this.shieldText.setText('shield: '+Math.round(this.shield)+'%');
	}

	Player.prototype.fire = function(x,y, mod){
		io.addToGroup('lasers', new Projectile(x,y, projectiles[this.weaponID].damage),-1)
				.createWithImage(projectiles[this.weaponID].image)
				.enableKinematics()
				.setBound('top', this.pos.y - projectiles[this.weaponID].range)
				.setVel(mod,-projectiles[this.weaponID].velocity);
		
	}
	Player.prototype.spawnRocket = function(){
		io.addToGroup('rockets', new Rocket(this.pos.x, this.pos.y-10))
				.createWithImage(projectiles[4].image);
	}
	
	