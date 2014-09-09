
function main(IO){
	io = IO;
	// io.activateDebugger();
	
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
	
	for(i=0; i<enemyImagPath.length; i++){
		enemyImag[i] = new Image();
		enemyImag[i].src = enemyImagPath[i];
		
	}
	for(i=0; i<projectiles.length; i++){
		projectiles[i].image = new Image();
		projectiles[i].image.src = projectiles[i].imagPath;
	}
	for(i=0; i<rockets.length; i++){
		rockets[i].image = new Image();
		rockets[i].image.src = rockets[i].imagPath;
	}
	for(i=0; i<enemyProjectiles.length; i++){
		enemyProjectiles[i].image = new Image();
		enemyProjectiles[i].image.src = enemyProjectiles[i].imgPath;
	}
	for(i=0; i<bonuses.length; i++){
		bonuses[i].image = new Image();
		bonuses[i].image.src = imgPath+bonuses[i].name+'.png';
	}

	
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
	
	bonusText = null;
	
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
			// io.addGroup('GUI', new iio.Text(bonuses[bonus.id].text,io.canvas.width/2,io.canvas.height/2)
						// .setFont('18px Impact')
						// .setTextAlign('center')
						// .setFillStyle('red'));
	textLifetime = 60;
	io.rmvFromGroup(bonusText, 'GUI');
	bonusText = io.addToGroup('GUI', new iio.Text(bonuses[bonus.id].text,io.canvas.width/2,io.canvas.height/2),-20)
						.setFillStyle('red')
						.setFont('58px Impact')
						.setTextAlign('center')
						.enableUpdates(function(){
							textLifetime--;
							bonusText.styles.alpha = textLifetime/60;
							if(textLifetime<=0){
								io.rmvFromGroup(this, 'GUI');
								return false;
							}
							return true;
						})
			io.rmvFromGroup(bonus, 'bonus');
	});
	io.setCollisionCallback('player', 'elasers', function(player_, elaser){
			
			player_.getHit(elaser.dmg);
			io.rmvFromGroup(elaser, 'elasers');
	});
	// io.setCollisionCallback('lasers', 'elasers', function(laser, elaser){
			
			// io.rmvFromGroup(elasers, 'elasers');
			// io.rmvFromGroup(laser, 'lasers');
	// });
	
	
	
	rampageText = io.addToGroup('GUI', new iio.Text('•Rampage•',io.canvas.width/2,15)
						.setFont('18px Impact')
						.setTextAlign('center')
						.setFillStyle('white'));
						
	var e1 = 0;
	var e2 = 5;
	var timer = 200;
	var release = iio.getRandomInt(7,1);
	io.setFramerate(60, function(){
		if(quit)
			io.cancelFramerate();
		if(rampage >= 100){
			rampageText.setText('Rampage');
		}
		else{
			var tmp = Math.round(rampage/10);
			var str = '';
			for(var i=0; i<tmp; i++)
				str += '•';
			rampage = Math.max(0, rampage - 0.05);
			// rampageText.setText('Rampage: '+Math.round(rampage)+'%');
			rampageText.setText(str);
		}
		player.updatePlayer();
		
		e1--;
		e2--;
		if(e1 <= 0){
			var enemies = io.getGroup('enemy');
			var enemyCount = enemies.length;
			for(var i=0; i<enemyCount; i++){
				enemies[i].updateSI();
			}
			e1 = 10;
		}
		if(e2 <= 0){
			var rockets = io.getGroup('rockets');
			var rocketsCount = rockets.length;
			var toDel = [];
			for(var i=0; i<rocketsCount; i++){
				if(rockets[i].updateSI())
					toDel.push(rockets[i]);
			}
			
			for(var i=0; i<toDel.length; i++){
				io.rmvFromGroup(toDel[i], 'rockets');
			}
			e2 = 10;
		}
		timer++;
		
		if(timer > release){
			timer = 0;
			release = iio.getRandomInt(30,50);
			var x = iio.getRandomInt(30,io.canvas.width-30);
			var y = iio.getRandomInt(-50,-100);
				io.addToGroup('enemy', new Enemy(x,y,iio.getRandomInt(0,enemyStats.length)));
				// .setBounds(null, io.canvas.width-50, null, 50, function(obj){
					// obj.vel.x = 0;
					// return true;
				// });
				// io.addToGroup('enemy', new Enemy(x,y,1));
			}
	});
}


