
var fps = 60;

var loadImages = function(obj, callback){
	var len = obj.length;
	var loaded = 0;
	for(var i=0; i<len; i++){
		// console.log('loading '+obj[i].name);
		obj[i].image = new Image();
		obj[i].image.onload = function(){
			if(++loaded >= len-1){
				loaded=-2;
				callback();
			}
				
		}
		obj[i].image.src = imgPath+obj[i].name+'.png';
		};
}

var mainApp = function(){

	var rampage = 0;
	io.addGroup('lasers');
	io.addGroup('rockets');
	io.addGroup('elasers');
	io.addGroup('player');
	io.addGroup('enemy');
	io.addGroup('bonus');
	io.addGroup('explosion');
	setBackground();
	player = io.addToGroup('player', new Player(io.canvas.center.x, io.canvas.height-100, 'Dez'));
	player.switchWeapon(1);

 	window.addEventListener('keydown', function(event){
		player.updateInput(event, true);

		// check for pause
		if(iio.keyCodeIs('pause', event) || iio.keyCodeIs('p', event))
					io.pauseFramerate();
	});
	window.addEventListener('keyup', function(event){
		player.updateInput(event, false);
	});
	
	// bonusText = null;
	
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
	io.setCollisionCallback('explosion', 'enemy', function(explosion, enemy){
		player.getPoints(enemy.hp);
		// enemy.hp -= explosion.dmg;
		enemy.hp -= 66;
		
		if (enemy.hp < 0){
			dropBonus(enemy.pos.x, enemy.pos.y);
			spawnExplosion(enemy.pos.x, enemy.pos.y);
			rampage+=5;
			io.addToGroup('limitedLifetime', new iio.SimpleRect(enemy.pos))
				.enableKinematics()
				.setBound('bottom', io.canvas.height+120)
				.createWithAnim(scrapAnim.getSprite(0,5),'scrap',0)
				.playAnim('scrap', 10, io)
				.setLifetime(60/10*6)
				.setVel(0, enemy.vel.y);
			
			io.rmvFromGroup(enemy, 'enemy');
		}
	});
	io.setCollisionCallback('player', 'enemy', function(player_, enemy){
		enemy.hp -= 100;
		player_.getHit(50);
		// if (enemy.hp < 0){
			spawnExplosion(enemy.pos.x, enemy.pos.y);
			rampage+=5;
			io.addToGroup('limitedLifetime', new iio.SimpleRect(enemy.pos))
				.enableKinematics()
				.setBound('bottom', io.canvas.height+120)
				.createWithAnim(scrapAnim.getSprite(0,5),'scrap',0)
				.playAnim('scrap', 10, io)
				.setLifetime(60/10*6)
				.setVel(0, enemy.vel.y);
			io.rmvFromGroup(enemy, 'enemy');
		// }
		if (player_.hp < 0){
			// delete player.owner.handle;
			// delete player.owner;
				// io.rmvFromGroup(player, 'player');
		}
	});
	io.setCollisionCallback('player', 'bonus', function(player_, bonus){
		bonuses[bonus.id].useBonus(player_);
		statement(bonuses[bonus.id].text);
		io.rmvFromGroup(bonus, 'bonus');
	});
	io.setCollisionCallback('player', 'elasers', function(player_, elaser){
			
			player_.getHit(elaser.dmg);
			io.rmvFromGroup(elaser, 'elasers');
	});
	
	rampageText = io.addToGroup('GUI', new iio.Text('•Rampage•',io.canvas.width/2,15)
						.setFont('18px Impact')
						.setTextAlign('center')
						.setFillStyle('white'));
	var e1 = 0;
	var e2 = 5;
	var t1 = 0;
	var release = 0 
	
	statement('Prepare');
	io.setFramerate(60, function(){
		if(quit)
			io.cancelFramerate();
		if(rampage >= 100){
			statement('✠RAMPAGE✠');
			rampageText.setText('Rampage');
			rampage = 0;
		}
		else{
			var tmp = Math.round(rampage/10);
			var str = '';
			for(var i=0; i<tmp; i++)
				str += '•';
			rampage = Math.max(0, rampage - 0.05);
			rampageText.setText(str);
		}
		
		t1++;
		
		if(t1 > release){
			t1 = 0;
			release = iio.getRandomInt(30,50);
			var x = iio.getRandomInt(30,io.canvas.width-30);
			var y = iio.getRandomInt(-50,-100);
				var tmp_en = io.addToGroup('enemy', new Enemy(x,y,iio.getRandomInt(0,enemyStats.length)))
			}
	});

}

function main(IO){
	io = IO;
	// io.activateDebugger();
	
	var scrapImage = new Image();
	scrapImage.src = imgPath+'enemyScrap.png';
	scrapAnim = new iio.SpriteMap(scrapImage,140,140);
	
	laserFlashImg = new Image();
	laserFlashImg.src = imgPath+'laserRedShot.png';
	image90 = new Image();
	image90.src = imgPath+'explosion.png';
	explosionAnim = new iio.SpriteMap(image90,100,100);
	
	bonusImg = new Image();
	bonusImg.src = imgPath+'bonus.png';
		
	
	statement('Prepare');
	
	loadImages(enemyStats,
		loadImages(enemyProjectiles,
			loadImages(projectiles,
			loadImages(rockets,
				loadImages(bonuses, mainApp)))));
}


