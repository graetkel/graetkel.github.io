//This is the original
/***********/

var AM = new AssetManager();
var gameEngine = new GameEngine();
var hero;
//used for reseting the powerup timers
//if the same powerup is picked up when it
//is already currently active on the hero
var firePowerupTimer;
var rapidFirePowerUpTimer;
var lightningPowerUpTimer;
var DoubleDamagePowerUpTimer;
var SpreadShotPowerUpTimer;

var map1 = new mapOne();
var map2 = new mapTwo();
var map3 = new mapThree();
var map4 = new mapFour();

var map = map1;


//In order to get the camera feature to work make sure every
//x position value is its position - cameraX

//The Game is 3200x700
//The Canvas is 800x700

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth
    , frameDuration, frames, loop) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.isDead = false;
}

//Added the 'scale' parameter and also set it so scaleBy is set to it
//if the caller adds the scale size to the end of the function call.
Animation.prototype.drawFrame = function (tick, ctx, x, y, scale) {
    var scaleBy = scale || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/*Play Game*/
function PlayGame(game, x, y) {        // THU add
    Entity.call(this, game, x, y);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
    this.game.running = false;
}
PlayGame.prototype.update = function () {
    if (this.game.click && this.game.Hero.lives > 0) this.game.running = true;
}

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "24pt Impact";
        ctx.fillStyle = "green";
        if (this.game.mouse) { ctx.fillStyle = "pink"; }
        if (this.game.Hero.lives == 3) {
			
            ctx.fillText("HIT IT!", this.x , this.y);
            console.log("HIT IT: ");
			console.log(this.x);
			console.log(this.y);

	    } if (this.game.Hero.lives < 3 && this.game.Hero.lives >= 1) {
            ctx.fillStyle = "red";
            ctx.fillText("TRY AGAIN!", this.x , this.y);
        } else if (this.game.Hero.lives > 0 && map == map4 && !this.game.running ) {
			ctx.fillText("Congratulation!", this.x, this.y);
		} else if (this.game.Hero.lives <= 0) {
            console.log("over");
			ctx.fillStyle = "red";
            ctx.fillText("GAME OVER!", this.x-30, this.y);
        
            ctx.fillStyle = "aqua"; 
            ctx.font = "20pt Impact";
            var scoresDisplay = "Total Score: " + this.game.Hero.scores;
            ctx.fillText(scoresDisplay, this.x-60, this.y + 100);
            ctx.fillStyle = "lime"; 
            ctx.font = "15pt Impact";
            ctx.fillText("Click to Play Again!", this.x-40, this.y + 200);
           
            if (this.game.click) {
                this.game.Hero.lives = 3;
                this.game.Hero.scores = 0;
                this.game.scores.innerHTML = "Scores: " + this.game.Hero.scores;
                this.game.lives.innerHTML = "Lives: " + this.game.Hero.lives;
            }
		}
    }
}

// no inheritance
function Cover(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Cover.prototype.reset = function () {
	this.x = 0;
	this.y = 0;
}

Cover.prototype.draw = function () {
	if (this.game.running) return;
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Cover.prototype.update = function () {
};

function HeroIcon(game, spritesheet) {
    this.x = 10;
    this.y = 635;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

HeroIcon.prototype.reset = function () {
	this.x = 10;
	this.y = 635;
}

HeroIcon.prototype.draw = function () {
	if (!this.game.running) return;
	if (!this.game.running) return;
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

HeroIcon.prototype.update = function () {
};

function GrenadeIcon(game, spritesheet) {
	this.x = 700;
	this.y = 625;
	this.spritesheet = spritesheet;
	this.game = game;
	this.ctx = game.ctx;
}

GrenadeIcon.prototype.reset = function() {
	this.x = 700;
	this.y = 625;
}

GrenadeIcon.prototype.draw = function() {
	if (!this.game.running) return;
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

GrenadeIcon.prototype.update = function () {
};

/**
 * The next 3 functions are the first level background image
 * setup to repeat infinitely.
 */
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.speed = -50
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.update = function () {
    var mainguy = this.game.entities[2];

    var mapWidth = map.cols * 25;

    if (this.game.d
         && cameraX != 0
         && this.game.entities[2].x < mapWidth - cameraMid
         && mainguy.crouch == false
         && mainguy.firingStance != 4
         && mainguy.firingStance != 0
         && mainguy.standingStance != 0
         && mainguy.wallCollide == false
         && mainguy.isCollide == false) {

        this.x += this.game.clockTick * this.speed;
    }
    if (this.game.a
         && cameraX != 0
         && this.game.entities[2].x < mapWidth - cameraMid
         && mainguy.crouch == false
         && mainguy.firingStance != 4
         && mainguy.firingStance != 0
         && mainguy.standingStance != 0
         && mainguy.wallCollide == false
         && mainguy.isCollide == false) {

        this.x -= this.game.clockTick * this.speed;
    }

    if (this.x < -2081) this.x = 0;
    if (this.x > 2081) this.x = 0;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y + cameraY);
    this.ctx.drawImage(this.spritesheet, this.x + 2077, this.y + cameraY);
    this.ctx.drawImage(this.spritesheet, this.x - 2077, this.y + cameraY);
};
Background.prototype.reset = function () {
}


/**
 * These are the functions which create the fire powerup
 */
function FirePowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 214, 207, 2, 0.10, 6, true);
    this.height = 60;
    this.width = 64;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    this.game = game;
    PowerUp.call(this, game, xLocation, yLocation);
}

FirePowerUp.prototype = new PowerUp();
FirePowerUp.prototype.constructor = FirePowerUp;
FirePowerUp.prototype.reset = function () {
}
FirePowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];

    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);

        //only applies if he doesnt have a defense powerup active
        if (mainguy.defensePowerUp == false) {
            mainguy.powerUpFire = true;
            mainguy.immune = true;
            mainguy.defensePowerUp = true;

            //if powerup is already active, clear the old timer
            //and start a new one.
            clearTimeout(firePowerupTimer);

            firePowerupTimer = setTimeout(function removeFire() {
                mainguy.powerUpFire = false;
                mainguy.immune = false;
                mainguy.defensePowerUp = false;
                }, 7000);
        }

    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

FirePowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, .3);
    }
}


/**
 * Heart Powerup
 */
function HeartPowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 100, 80, 6, 0.10, 6, true);
    this.height = 60;
    this.width = 75;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    PowerUp.call(this, game, xLocation, yLocation);
}

HeartPowerUp.prototype = new PowerUp();
HeartPowerUp.prototype.constructor = HeartPowerUp;
HeartPowerUp.prototype.reset = function () {
	this.falling = false;
}


HeartPowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];

    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);
        //console.log("health picked up");

        if (mainguy.health < 10) {
            mainguy.health++;
        }
    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

HeartPowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, .75);
    }
}

/**
 * Grenade Powerup
 */
function GrenadePowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 200, 200, 1, 0.10, 1, true);
    this.height = 60;
    this.width = 75;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    PowerUp.call(this, game, xLocation, yLocation);
}

GrenadePowerUp.prototype = new PowerUp();
GrenadePowerUp.prototype.constructor = GrenadePowerUp;
GrenadePowerUp.prototype.reset = function () {
	this.falling = false;
}


GrenadePowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];

    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);

        if (mainguy.grenadeCount < 3) {
            mainguy.grenadeCount++;
            console.log(mainguy.grenadeCount);
        }
    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

GrenadePowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, .27);
    }
}

/*
* Rapid Fire Powerup
*/
function RapidFirePowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 519, 139, 2, 0.10, 2, true);
    this.height = 25;
    this.width = 100;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    PowerUp.call(this, game, xLocation, yLocation);
}

RapidFirePowerUp.prototype = new PowerUp();
RapidFirePowerUp.prototype.constructor = RapidFirePowerUp;

RapidFirePowerUp.prototype.reset = function () {
	this.falling = false;
}


RapidFirePowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];

    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);

        if (mainguy.offensePowerUp == false) {
            mainguy.powerUpRapidFire = true;
            mainguy.offensePowerUp = true;

            //if powerup is already active, clear the old timer
            //and start a new one.
            clearTimeout(rapidFirePowerUpTimer);

            rapidFirePowerUpTimer = setTimeout(function removeRapidFire() {
                mainguy.powerUpRapidFire = false;
                mainguy.offensePowerUp = false;
                }, 7000);
        }
    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

RapidFirePowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, .3);
    }
}

/*
* double damage Powerup
*/
function DoubleDamagePowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 200, 200, 1, 0.10, 1, true);
    this.height = 25;
    this.width = 100;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    PowerUp.call(this, game, xLocation, yLocation);
}

DoubleDamagePowerUp.prototype = new PowerUp();
DoubleDamagePowerUp.prototype.constructor = DoubleDamagePowerUp;

DoubleDamagePowerUp.prototype.reset = function () {
	this.falling = false;
}


DoubleDamagePowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];

    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);

        if (mainguy.offensePowerUp == false) {

            mainguy.DoubleDamagePowerUp = true;
            mainguy.offensePowerUp = true;

            //if powerup is already active, clear the old timer
            //and start a new one.
            clearTimeout(DoubleDamagePowerUpTimer);

            DoubleDamagePowerUpTimer = setTimeout(function removeDoubleDamage() {
                mainguy.DoubleDamagePowerUp = false;
                mainguy.offensePowerUp = false;
                }, 7000);
        }
    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

DoubleDamagePowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, .3);
    }
}

/*
* spread shot Powerup
*/
function SpreadShotPowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 225, 225, 1, 0.10, 1, true);
    this.height = 25;
    this.width = 100;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    PowerUp.call(this, game, xLocation, yLocation);
}

SpreadShotPowerUp.prototype = new PowerUp();
SpreadShotPowerUp.prototype.constructor = SpreadShotPowerUp;

SpreadShotPowerUp.prototype.reset = function () {
	this.falling = false;
}


SpreadShotPowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];

    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);

        if (mainguy.offensePowerUp == false) {
            mainguy.SpreadShotPowerUp = true;
            mainguy.offensePowerUp = true;

            //if powerup is already active, clear the old timer
            //and start a new one.
            clearTimeout(SpreadShotPowerUpTimer);

            SpreadShotPowerUpTimer = setTimeout(function removeDoubleDamage() {
                mainguy.SpreadShotPowerUp = false;
                mainguy.offensePowerUp = false;
                }, 7000);
        }
    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

SpreadShotPowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, .2);
    }
}

/*
* Lightning Powerup
*/
function lightningPowerUp(game, spritesheet, xLocation, yLocation) {
    this.animation = new Animation(spritesheet, this.x, this.y, 58.57, 58.28, 7, 0.10, 49, true);
    this.height = 25;
    this.width = 100;
    this.speed = 0;
    this.falling = false;
    this.ctx = game.ctx;
    PowerUp.call(this, game, xLocation, yLocation);
}

lightningPowerUp.prototype = new PowerUp();
lightningPowerUp.prototype.constructor = lightningPowerUp;

lightningPowerUp.prototype.reset = function () {
	this.falling = false;
}


lightningPowerUp.prototype.update = function () {
    var mainguy = this.game.entities[2];
    playaudioFX(gameEngine, "./music/Shock.m4a")
    if (powerUpCollide(this, mainguy)) {
        gameEngine.removePowerUp(this);

        if (mainguy.defensePowerUp == false) {
            mainguy.powerUpLightning = true;
            mainguy.defensePowerUp = true;

            //if powerup is already active, clear the old timer
            //and start a new one.
            clearTimeout(lightningPowerUpTimer);

            lightningPowerUpTimer = setTimeout(function removeLightningPowerup() {
                mainguy.powerUpLightning = false;
                mainguy.defensePowerUp = false;
                }, 7000);
        }


    }

    var groundX = Math.round(this.x/25) +1;
    var groundY = Math.round(this.y/25);

    if (this.y <= 15 || (this.y + 35) >= 675) {
      gameEngine.removePowerUp(this);
    }

    //if in the air, fall
    if (!(map.layer[groundY+1][groundX] == 'v'
            || map.layer[groundY+1][groundX] == 'a'
            || map.layer[groundY+1][groundX] == 'd')) {
          this.falling = true;
        }

    if (this.falling) {
          if (map.layer[groundY+1][groundX] == 'v'
              || map.layer[groundY+1][groundX] == 'a'
              || map.layer[groundY+1][groundX] == 'd') {
               this.falling = false;
          } else {
            if (this.falling) {
              this.y += 3;
            }
          }
        }
}

lightningPowerUp.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY, 1);
    }
}


/*
* Lightning object itself
*/
function Lightning(game, sX, sY, eX, eY, strikes) {
    this.ctx = game.ctx;
    this.x = sX;
    this.y = sY;
    this.endX = eX;
    this.endY = eY;
    this.fade = 1.0;
    this.bolts = getDemBolts(this.x, this.y, this.endX, this.endY);
    Entity.call(this, game, sX, sY);
}

Lightning.prototype = new Entity();
Lightning.prototype.constructor = Lightning;

Lightning.prototype.draw = function () {
    this.color = "hsla(180, 100%, 60%, "+ this.fade +")";
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 10;
    //this.ctx.globalCompositeOperation = "lighter";
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    //this.ctx.moveTo(this.x, this.y);
    //this.ctx.lineTo(this.endX, this.endY);
    for (var i = 0; i < this.bolts.length; i++) {
        this.ctx.lineTo(this.bolts[i].x, this.bolts[i].y);
    }
    this.ctx.stroke();
}

Lightning.prototype.update = function () {
    this.fade -= 0.03;
    //console.log(this.fade);
    if (this.fade <= 0.0) {
        this.game.removeEntity(this);
    }
}

//called to turn the straight line between two points
//into a 'lightning bolt'
function getDemBolts(startX, startY, endX, endY) {
    var bolts = [];
    var minSegmentLength = 7;
    var a = startX - endX;
    var b = startY - endY;
    var segmentLength = Math.ceil(Math.sqrt( a*a + b*b ));
    var roughness = 1.4;
    var currDiff = segmentLength / 10;

    bolts.push({x: startX, y: startY});
    bolts.push({x: endX, y: endY});

    //will keep going until the segments are the minimum length
    //pushing the new line pieces into a new array
    while (segmentLength > minSegmentLength) {
        var newSegments = [];
        for (var i = 0; i < bolts.length - 1; i++) {
            var start = bolts[i];
            var end = bolts[i + 1];
            var midX = (start.x + end.x) / 2;
            var midY = (start.y + end.y) / 2;

            var newX = midX + (Math.random() * 2 - 1) * currDiff;
            var newY = midY + (Math.random() * 2 - 1) * currDiff;
            newSegments.push(start, {x: newX, y: newY});

        }
        newSegments.push(bolts.pop());
        bolts = newSegments;
        currDiff /= roughness;
        segmentLength /= 2;
    }
    return bolts;
}

//generate random lightning bolts
// setInterval(function() {
//     var sx2 = 710; //Math.floor(Math.random() * 700) +1 ;
//     var sy2 = 40; //Math.floor(Math.random() * 700) +1 ;
//     //var ex2 = 635;
//     //var ey2 = 115;
//     var ex2 = Math.floor(Math.random() * 700) +1 ;
//     var ey2 = Math.floor(Math.random() * 700) +1 ;
//     gameEngine.addEntity(new Lightning(gameEngine, sx2, sy2, ex2, ey2));
// }, 2000)



//used for testing if hero collides with
//any of the powerups
function powerUpCollide(powerup, hero) {
    var rect1 = {x: powerup.x, y: powerup.y, width: powerup.width, height: powerup.height}
    var rect2 = {x: hero.x, y: hero.y, width: hero.width, height: hero.height}
    if (rect1.x < rect2.x + rect2.width
    && rect1.x + rect1.width > rect2.x
    && rect1.y < rect2.y + rect2.height
    && rect1.height + rect1.y > rect2.y) {
        return true;
    }
}






// no inheritance
function Platform(game) {
    this.x = 0;
    this.y = 0;
    this.speed = -300
    this.game = game;
    this.ctx = game.ctx;
};

Platform.prototype.reset = function () {
    this.x = 0;
    this.y = 0;
}


Platform.prototype.draw = function () {
    var posX = this.x - cameraX;
    var sqFt = 25;
    var xAxis, yAxis;

    for (yAxis = 0; yAxis < map.rows; yAxis++) {
      for (xAxis = 0; xAxis < map.cols; xAxis++) {
        var obstacle = map.layer[yAxis][xAxis];

            function tilePicker(color) {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(sqFt * xAxis - cameraX, 25 + sqFt * yAxis, sqFt, sqFt);
            };

            var xCoor = sqFt * xAxis - cameraX;
            var yCoor = 25 + sqFt * yAxis + cameraY;
            if (map == map3) {
            switch (obstacle) {
                case 'c': // middle ground
                      this.ctx.drawImage(AM.getAsset("./img/midFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'v': // top ground
                    this.ctx.drawImage(AM.getAsset("./img/nFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'z': // west ground
                    this.ctx.drawImage(AM.getAsset("./img/wFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'x': // east ground
                    this.ctx.drawImage(AM.getAsset("./img/eFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'b': // bottom ground
                    this.ctx.drawImage(AM.getAsset("./img/sFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'a': // NW Ground
                    this.ctx.drawImage(AM.getAsset("./img/nwFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 's': // SW Ground
                    this.ctx.drawImage(AM.getAsset("./img/swFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'd': // NE Ground
                    this.ctx.drawImage(AM.getAsset("./img/neFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'f': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/seFloor.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                    //---

                case 'p': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/panel.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'w': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/vent.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'e': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/bigGreenLights.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'r': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/bigRedLights.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 't': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/smallGreenLights.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'y': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/smallRedLights.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'g': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/green.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'l': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/lava.png"), xCoor, yCoor, sqFt, sqFt);
                    break;

                    //green back
                    // AM.queueDownload("./img/bigGreenLights.png");
                    // AM.queueDownload("./img/bigRedLights.png");
                    // AM.queueDownload("./img/green.png");
                    // AM.queueDownload("./img/panel.png");
                    // AM.queueDownload("./img/smallGreenLights.png");
                    // AM.queueDownload("./img/smallRedLights.png");
                    // AM.queueDownload("./img/vent.png");
                    //----


            }//End of switch
          } else {

            switch (obstacle) {
                case 'c': // middle ground
                      this.ctx.drawImage(AM.getAsset("./img/ground1.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'v': // top ground
                    this.ctx.drawImage(AM.getAsset("./img/ground2.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'z': // left ground
                    this.ctx.drawImage(AM.getAsset("./img/ground3.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'x': // right ground
                    this.ctx.drawImage(AM.getAsset("./img/ground4.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'b': // bottom ground
                    this.ctx.drawImage(AM.getAsset("./img/ground5.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'a': // NW Ground
                    this.ctx.drawImage(AM.getAsset("./img/nwGround.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 's': // SW Ground
                    this.ctx.drawImage(AM.getAsset("./img/swGround.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'd': // NE Ground
                    this.ctx.drawImage(AM.getAsset("./img/neGround.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'f': // SE Ground
                    this.ctx.drawImage(AM.getAsset("./img/seGround.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 't': // tree trunk
                    this.ctx.drawImage(AM.getAsset("./img/treeTrunk.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'l': // middle leaf
                    this.ctx.drawImage(AM.getAsset("./img/leaf1.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'u': // NW leaf
                    this.ctx.drawImage(AM.getAsset("./img/leaf2.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'i': // NE leaf
                    this.ctx.drawImage(AM.getAsset("./img/leaf3.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'o': // SW leaf
                    this.ctx.drawImage(AM.getAsset("./img/leaf4.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'p': // SE leaf
                    this.ctx.drawImage(AM.getAsset("./img/leaf5.png"), xCoor, yCoor, sqFt, sqFt);
                    break;
                case 'w': // concrete walls
                    //tilePicker("gray");
                    break;
                case 'd': // door
                    //tilePicker("SaddleBrown");
                    break;

            }//End of switch
          }


        }
    }
    Entity.prototype.draw.call(this);
};

Platform.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
};

function Camera(game) {
  this.game = game;
  this.xOffset = this.game.entities[1].x;
  this.yOffset = this.game.entities[1].y;
  this.width = 800;
  this.height = 700;
  this.speed = 200;
}

Camera.prototype = new Entity();
Camera.prototype.constructor = Camera;

Camera.prototype.reset = function () {
}

var cameraX = 0;
var cameraY = 0;

Camera.prototype.update = function() {

  var mapWidth = map.cols * 25;
  cameraMid = (this.game.ctx.canvas.width / 2);
  if (this.game.entities[2].x < cameraMid) {
    cameraX = 0;
  } else if (this.game.entities[2].x > mapWidth - cameraMid) {
    cameraX = mapWidth - this.game.ctx.canvas.width;
  } else {
    cameraX = this.game.entities[2].x - cameraMid;
  }

  //The Y coordinates have been of this whole time.
  cameraY = -1 * (this.game.ctx.canvas.width/map.rows);

}

Camera.prototype.draw = function() {
}

function collide(thisUnit, otherUnit) {
    var rect1 = {x: thisUnit.x, y: thisUnit.y, width: thisUnit.width, height: thisUnit.height}
    var rect2 = {x: otherUnit.x, y: otherUnit.y, width: otherUnit.width, height: otherUnit.height}
    if (otherUnit.unitType === "giantRobot") {
        rect2.width = 100;
        rect2.x = otherUnit.x + 80;
    }
    if (otherUnit.standingStance === 0) {
        rect2.height = 10;
        rect2.y = otherUnit.y + 75;
    }
    if (otherUnit.crouch) {
        rect2.height = 30;
        rect2.y = otherUnit.y + 60;
    }
    if (rect1.x < (rect2.x + rect2.width)
    && (rect1.x + rect1.width) > rect2.x
    && rect1.y < (rect2.y + rect2.height)
    && (rect1.height + rect1.y) > rect2.y) {
        if (otherUnit.isBullet) {
        }
        else if (!otherUnit.isBullet){
            if (thisUnit.isBullet) {
                if (otherUnit.enemy && !(thisUnit.unitType === "hero")) {
                    if (otherUnit.unitType === "blueRobot") thisUnit.removeFromWorld = true;

                }
                else {
                    if (thisUnit.unitType !== otherUnit.unitType) {
                        if (otherUnit.unitType !== "blueRobot") {
                            if (!otherUnit.immune)  {
                                if (!isNaN(thisUnit.damage)) otherUnit.health -= thisUnit.damage;
                                else otherUnit.health--;
                            }
                        }
                        if (otherUnit.hero && !otherUnit.immune) {
                            otherUnit.hurt = true;
                        }
                        thisUnit.removeFromWorld = true;
                    }
                }
            }
            if (thisUnit.hero) {
                if (otherUnit.landMine) {
                    if (!thisUnit.immune) {
                        thisUnit.health -= 4;
                        thisUnit.hurt = true;

                    }
                    otherUnit.health = 0;
                }
                else if (otherUnit.enemy && !thisUnit.immune){
                    thisUnit.hurt = true;
                    thisUnit.health -= 1;
                }
                if (thisUnit.x < otherUnit.x) thisUnit.collideForward = true;
                else thisUnit.collideForward = false;
            }
            else if (thisUnit.enemy) {
                if (otherUnit.hero) {
                    if (otherUnit.x < thisUnit.x) otherUnit.collideForward = true;
                    else otherUnit.collideForward = false;
                }
                else if (otherUnit.landMine) {
                    return false;
                }
            }
        }
        return true;
    }
};

// inheritance
function Hero(game, heroSprites,speed, ground, health, lives) {
    this.frontRun = new Animation(heroSprites[0], this.x, this.y, 105, 101, 8, 0.1, 8, true);
    this.backRun = new Animation(heroSprites[1], this.x, this.y, 105, 102, 8, 0.1, 8, true);
    this.frontStand = new Animation(heroSprites[2], this.x, this.y, 98, 100, 1, 0.1, 1, true);
    this.backStand = new Animation(heroSprites[3], this.x, this.y, 98, 100, 1, 0.1, 1, true);
    this.frontJump = new Animation(heroSprites[4], this.x, this.y, 105, 107, 1, 1.5, 1, false);
    this.backJump = new Animation(heroSprites[5], this.x, this.y, 105, 103, 1, 1.5, 1, false);
    this.backCrawl = new Animation(heroSprites[6], this.x, this.y, 138, 100, 1, 0.1, 1, true);
    this.frontCrawl = new Animation(heroSprites[7], this.x, this.y, 141, 100, 1, 0.1, 1, true);
    this.front45Up = new Animation(heroSprites[8], this.x, this.y, 99, 101, 1, 0.1, 1, true);
    this.front45UpRun = new Animation(heroSprites[9], this.x, this.y, 91, 101, 8, 0.1, 8, true);
    this.front45Down = new Animation(heroSprites[10], this.x, this.y, 99, 102, 1, 0.1, 1, true);
    this.front45DownRun = new Animation(heroSprites[11], this.x, this.y, 92, 101, 8, 0.1, 8, true);
    this.back45Up = new Animation(heroSprites[12], this.x, this.y, 99, 101, 1, 0.1, 1, true);
    this.back45UpRun = new Animation(heroSprites[13], this.x, this.y, 90, 100, 8, 0.1, 8, true);
    this.back45Down = new Animation(heroSprites[14], this.x, this.y, 88, 102, 1, 0.1, 1, true);
    this.back45DownRun = new Animation(heroSprites[15], this.x, this.y, 91, 101, 8, 0.1, 8, true);
    this.frontDown90Hero = new Animation(heroSprites[16], this.x, this.y, 90, 102, 1, 0.1, 1, true);
    this.frontDamageHero = new Animation(heroSprites[17], this.x, this.y, 100, 100, 1, 0.1, 1, true);
    this.frontCrouchHero = new Animation(heroSprites[18], this.x, this.y, 96, 80, 1, 0.1, 1, true);
    this.frontUp90Hero = new Animation(heroSprites[19], this.x, this.y, 90, 102, 1, 0.1, 1, true);
    this.backUp90Hero = new Animation(heroSprites[20], this.x, this.y, 90, 102, 1, 0.1, 1, true);
    this.backDown90Hero = new Animation(heroSprites[21], this.x, this.y, 91, 102, 1, 0.1, 1, true);
    this.backDamageHero = new Animation(heroSprites[22], this.x, this.y, 100, 100, 1, 0.1, 1, true);
    this.backCrouchHero = new Animation(heroSprites[23], this.x, this.y, 100, 80, 1, 0.1, 1, true);
    this.frontDamageHero = new Animation(heroSprites[24], this.x, this.y, 100, 100, 1, .5, 1, true);
    this.backDamageHero = new Animation(heroSprites[25], this.x, this.y, 100, 100, 1, 0.1, 1, true);
    this.flameFrontStand = new Animation(heroSprites[26], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameBackStand = new Animation(heroSprites[27], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameFrontRun = new Animation(heroSprites[28], this.x, this.y, 214, 180, 3, 0.1, 8, true);
    this.flameBackRun = new Animation(heroSprites[29], this.x, this.y, 214, 180, 3, 0.1, 8, true);
    this.flameFrontCrawl = new Animation(heroSprites[30], this.x, this.y, 220, 117.5, 2, 0.1, 6, true);
    this.flameBackCrawl = new Animation(heroSprites[31], this.x, this.y, 220, 117.5, 2, 0.1, 6, true);
    this.flameFrontJump = new Animation(heroSprites[32], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameBackJump = new Animation(heroSprites[33], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameFront45Up = new Animation(heroSprites[34], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameBack45Up = new Animation(heroSprites[35], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameFront45UpRun = new Animation(heroSprites[36], this.x, this.y, 214, 180, 3, 0.1, 8, true);
    this.flameBack45UpRun = new Animation(heroSprites[37], this.x, this.y, 214, 180, 3, 0.1, 8, true);
    this.flameFront45DownRun = new Animation(heroSprites[38], this.x, this.y, 214, 180, 3, 0.1, 8, true);
    this.flameBack45DownRun = new Animation(heroSprites[39], this.x, this.y, 214, 180, 3, 0.1, 8, true);
    this.flameBack45Down = new Animation(heroSprites[40], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameFront45Down = new Animation(heroSprites[41], this.x, this.y, 214, 180, 2, 0.1, 6, true);
    this.flameFrontCrouchHero = new Animation(heroSprites[42], this.x, this.y, 130, 91, 2, 0.1, 6, true);
    this.flameBackCrouchHero = new Animation(heroSprites[43], this.x, this.y, 130, 91, 2, 0.1, 6, true);
    this.flameFrontUp90Hero = new Animation(heroSprites[44], this.x, this.y, 130, 111, 2, 0.1, 6, true);
    this.flameBackUp90Hero = new Animation(heroSprites[45], this.x, this.y, 130, 111, 2, 0.1, 6, true);
    this.flameFrontDown90Hero = new Animation(heroSprites[46], this.x, this.y, 130, 111, 2, 0.1, 6, true);
    this.flameBackDown90Hero = new Animation(heroSprites[47], this.x, this.y, 130, 111, 2, 0.1, 6, true);
    this.lightningOrb = new Animation(heroSprites[48], this.x, this.y, 58.57, 58.28, 7, 0.10, 49, true);


    this.jumping = false;
    this.speed = speed;
    //this.speed = 1000;

    this.health = health;
    this.hero = true;

	this.scores = 0;
	this.times = 300;
    this.lives = lives;
	this.dead = false;
	this.box = health;

    this.unitType = "hero";
    this.ctx = game.ctx;
    this.floor = 500;
    this.ground = 500;
    this.firingStance = 2;
    this.width = 70;
    this.hurtCount = 6;
    this.SpreadShotPowerUp = false;
    this.collideForward = true;
    this.height = 90;
    this.hurt = false;
    this.damage = 1;
    this.standingStance = 2;
    this.runFlag = false;
    this.firing = false;
    this.immuneCount = 20;
    this.CanShoot = true;
    this.jumpForward = true;
    this.standForward = true;
    this.crouch = false;
    this.grenadeCount = 1;
    this.runshooting = false;
    this.immune = false;
    this.falling = false;
    this.spaceTime = 0;
    this.tempCeiling = 0;
    this.standtemp = 2;
    this.lookingRight = true;
    this.powerUpFire = false;
    this.powerUpRapidFire = false;
    this.powerUpLightning = false;
    this.DoubleDamagePowerUp = false;
    this.wallCollide = false;
    this.shootTemp = 2;
    this.throwGernade = false;

    this.defensePowerUp = false;
    this.offensePowerUp = false;

    Entity.call(this, game, 100, 525);
}

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

Hero.prototype.reset = function () {			// THU add
    this.x = 100;
	this.y = 500;
    this.jumping = false;
    this.hero = true;
    this.throwGernade = false;
	this.times = 300;
	this.health = this.box;
	this.dead = false;
    this.lives--;
    this.hurt = false;
    this.runFlag = false;
    this.runshooting = false;
    this.firing = false;
    this.immuneCount = 20;
    this.CanShoot = true;
    this.jumpForward = true;
    this.standForward = true;
    this.crouch = false;
    this.immune = false;
    this.falling = false;
    this.grenadeCount = 1;
    this.spaceTime = 0;
    this.lookingRight = true;
    this.powerUpFire = false;
    this.powerUpRapidFire = false;
    this.powerUpLightning = false;
    this.runshooting = false;
    this.wallCollide = false;
    this.standtemp = 2;
    this.shootTemp = 2;
    this.standingStance = 2;
    this.firingStance = 2;
    if (this.lives <= 0) { 
        this.lives = 0;
        if (!this.game.running)
		this.game.total_scores.innerHTML = "Total Score: " + this.scores;
	}
	if (this.times <= 0) this.times = 0;
    this.game.lives.innerHTML = "Lives: " + this.lives;
	this.game.times.innerHTML = "Time: " + this.times;
	
	
}

Hero.prototype.update = function () {

    if (this.DoubleDamagePowerUp) {
        this.damage = 2;
    }
    else {
        this.damage = 1;
    }
	if (this.game.running) {

        //used for cycling through the entities to shoot lightning at bullets
        //thats come withing 250 pixels of the hero if lightning buff is on
        if (this.powerUpLightning == true) {
            for (var i = 0; i < this.game.entities.length; i ++) {
                if (this.game.entities[i].isBullet == true && this.game.entities[i].heroShotIt == false) {

                    //get distance from hero
                    var a = this.x - this.game.entities[i].x;
                    var b = this.y - this.game.entities[i].y;
                    var bulletDistance = Math.ceil(Math.sqrt( a*a + b*b ));

                    //makes the lightning strike and removes the bullet
                    //if the bullet is within 250 pixels
                    if (bulletDistance < 250) {
                        gameEngine.addEntity(new Lightning(gameEngine, this.x - cameraX +40, this.y - 50,
                                                             this.game.entities[i].x -cameraX, this.game.entities[i].y));
                        this.game.entities[i].removeFromWorld = true;
                    }
                }
            }
        }


		//console.log(this.x);
		//---- Next level --------
		if (this.x >= ((map.cols * 25) - 100)) {
		   NextLevel(this.game);
		}
		this.times -= this.game.clockTick;
			this.game.times.innerHTML = "Time: " + Math.round(this.times);
			if (this.health <= 0)
				this.dead = true;
			if (this.dead) {
				this.game.reset();
				this.game.running = false;

				return;
			}
			if (this.times < 0) {
				this.game.gameState.innerHTML = "Time Out!";
				this.lives = 0;
				this.times = 0;
				this.game.lives.innerHTML = "Lives: " + this.lives;
				this.game.times.innerHTML = "Time: " + this.times;
				this.game.total_scores.innerHTML = "Total Score: " + this.scores;
				this.game.running = false;
			}
			//console.log(this.game.entities[1].x);
      //You cant just have a hard coded value here!!!!!
      // var endPointOnMap = (map.cols * 25) - 100;
			// if (this.x > endPointOnMap) {
      //   this.game.running = false;
			// 	this.game.gameState.innerHTML = "Well Done, Level Complete!";
			// 	if (this.times > 0) {
			// 		while (this.times > 0) {
			// 			this.game.scores += 1000;
			// 			this.times--;
			// 		}
      //     this.game.reset();
      //     NextLevel(this.game);
			// 	}
			// 	this.game.running = false;
      //   // NextLevel(this.game);
			// }
			if (this.lives <= 0) {
				this.removeFromWorld = true;
			}
			if (this.times <= 0) {
				this.game.running = false;
				this.game.grenades.innerHTML = "";
			}
		//console.log(this.game.entities[2].x);

		this.isCollide = false;
		for (var i = 0; i < this.game.entities.length; i++) {
			var ent = this.game.entities[i];
			if (ent !== this && collide(this, ent)) {

				if (!ent.isBullet) this.isCollide = true;
				if (this.x < ent.x) this.collideForward = true;
			}
		}
		if (this.game.aimUp && !this.jumping && this.standingStance === 2) {
			if (this.firingStance < 4) {
				this.firingStance += 1;
			}
		}
		if (this.game.aimDown && !this.jumping && this.standingStance === 2) {
			if (this.firingStance > 1) {
				this.firingStance -= 1;
			}
		}
		if (this.game.a) {
			if (!this.jumping) {
			  this.jumpForward = false;
			  this.lookingRight = false;
			}
			this.standForward = false;
			this.runFlag = true;
		}
        if (this.game.gernadeThrow) {
            this.throwGernade = true;
        }
        else {
            this.throwGernade = false;
        }
		if (this.game.d) {
			if (!this.jumping) {
			  this.jumpForward = true;
			  this.lookingRight = true;
			}
			this.standForward = true;
			this.runFlag = true;
		}

		if (!this.game.a && !this.game.d) {
			this.runFlag = false;
		}

		if (this.game.shooting) this.firing = true;
		else this.firing = false;

		if (this.game.s && !this.jumping) {
			if (this.standingStance > 0) {
				this.standingStance -= 1;
				this.firingStance = 2;
			}
		}

		if (this.game.w && !this.jumping) {
			if (this.standingStance < 2) {
				this.standingStance += 1;
				this.firingStance = 2;
			}
		}

	//---------
		if (this.game.space) {
		  if (!this.falling && !this.jumping) {
			this.jumping = true;
			this.falling = false;
			this.spaceTime = this.game.timer.gameTime + 0.5;
      this.tempCeiling = this.y - 150;
		  }
		}
    //---------

		if ((this.firingStance === 0 || this.firingStance === 4) && this.runFlag) {
            this.runshooting = true;
            this.shootTemp = this.firingStance;
            this.firingStance = 2;
        }
        if (this.runshooting && !this.runFlag) {
            this.firingStance = this.shootTemp;
            this.runshooting = false;
        }
		if (this.standingStance === 1) {

			this.crouch = true;
		}
		else {
			this.crouch = false;
        }

        if (this.standingStance !== 2 && this.runFlag) {
            this.standtemp = this.standingStance;
            this.standingStance = 2;
            this.runCrouch = true;
            this.crouch = false;
        }
        if (this.runCrouch && !this.runFlag) {
            this.standingStance = this.standtemp;
            if (this.standingStance === 1) {
                this.crouch = true;
            }
            this.runCrouch = false;
        }
		var totalHeight = 200;
		that = this;

		if (this.immune && !this.powerUpFire) {
			if (this.immuneCount > 0 ) {
				this.immuneCount -= 1;
			}
			else {
				this.immune = false;
				this.immuneCount = 20;
			}
		}

		if (!this.powerUpFire) {
			//-------------------------------------
			//&*&*&*&*  This is the hero's grid values  &*&*&**&*&*&**&*&*
			var heroGroundX = Math.round(this.x/25) + 1;
			var heroGroundY = Math.round(this.y/25);
			//&*&*&*&*&*&*&*&*&*&*&*&*&*&**&*&*&*&*&*&*&*&*&*&*&**&*&*&*&*
		} else {
			//This is what I (Ryan) Added in
			//looks like it fixed it. Not 100% Though.
			var heroGroundX = Math.round(this.x/25) +2;
			var heroGroundY = Math.round(this.y/25);
		}

      //If Hero goes to far up or down this statement will kill the hero
      if ((this.y + 75) >= 675) {
        this.game.reset();
      }
      if (this.y <= 20) {
        this.jumping = false;
        this.falling = true;
      }

			if (this.jumping || this.falling) {
                this.firingStance = 2;
                this.standingStance = 2;
			  this.frontJump.elapsedTime = 0;
			  this.backJump.elapsedTime = 0;
			}
			//### Start ##############################################################

			//This makes the hero go up if he jumps and once he gets to the top he falls
			if (this.jumping) {
			  if (map.layer[heroGroundY-1][heroGroundX] == 's'
				  || map.layer[heroGroundY-1][heroGroundX] == 'b'
				  || map.layer[heroGroundY-1][heroGroundX] == 'f') {
				this.jumping = false;
				this.falling = true;
			  } else {
				// if (this.game.timer.gameTime <= this.spaceTime) {
        if (this.tempCeiling <= this.y) {
				  this.y = this.y - 5;
				  this.falling = false;
				} else {
				  this.falling = true;
				  this.jumping = false;
				}
			  }
			}

			//If there is no platform right below hero, start falling
			if (!this.jumping && !(map.layer[heroGroundY+3][heroGroundX] == 'v'
				|| map.layer[heroGroundY+3][heroGroundX] == 'a'
				|| map.layer[heroGroundY+3][heroGroundX] == 'd')) {
			  this.falling = true;
			}

			//If hero is falling
			if (this.falling) {
			  //If there is a floor below the hero make it that the hero is not falling or jumping

			  if (map.layer[heroGroundY+3][heroGroundX] == 'v'
				  || map.layer[heroGroundY+3][heroGroundX] == 'a'
				  || map.layer[heroGroundY+3][heroGroundX] == 'd') {
				   this.falling = false;
				   this.jumping = false;
				   //Since I'm rounding the hero always land 10 pixels to early so I added some hard code.
				   this.y += 10 //this only happens once
			  } else {
				//if there is do platform below hero fall down, sum amount of pixels
				if (this.falling) {
				  this.y += 5;
				}
			  }
			} // End of if falling statement

			//variable used for passing to inline
			//function for wall detection
			var mainguy = this.game.entities[2];

			if (this.runFlag) {
			  //If there is a wall right of the hero
			  if (this.game.d) {
				//Right of hero's head
				if (map.layer[heroGroundY][heroGroundX+1] == 'a'
					|| map.layer[heroGroundY][heroGroundX+1] == 'z'
					|| map.layer[heroGroundY][heroGroundX+1] == 's') {
                      if (!this.hurt) this.x -= this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                                mainguy.wallCollide = false;
                                }, 400);
                            }
				}
				//Right of hero's torso
				if (map.layer[heroGroundY+1][heroGroundX+1] == 'a'
					|| map.layer[heroGroundY+1][heroGroundX+1] == 'z'
					|| map.layer[heroGroundY+1][heroGroundX+1] == 's') {
						if (!this.hurt) this.x -= this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                                mainguy.wallCollide = false;
                                }, 400);
                        }
				}
				//Right of hero's legs
				if (map.layer[heroGroundY+2][heroGroundX+1] == 'a'
					|| map.layer[heroGroundY+2][heroGroundX+1] == 'z'
					|| map.layer[heroGroundY+2][heroGroundX+1] == 's') {
                        if (!this.hurt) this.x -= this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                            mainguy.wallCollide = false;
                            }, 400);
                            }
				}
				//Right of the ground below hero (Need this for special cases)
				if ((map.layer[heroGroundY+3][heroGroundX+1] == 'a'
					|| map.layer[heroGroundY+3][heroGroundX+1] == 'z'
					|| map.layer[heroGroundY+3][heroGroundX+1] == 's')
					&& this.falling) {
                        if (!this.hurt) this.x -= this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                            mainguy.wallCollide = false;
                            }, 400);
                            }
				}
			  }

			  //If there is a wall left of the hero
			  if (this.game.a) {
				//Left of hero's head
				if (map.layer[heroGroundY][heroGroundX-1] == 'd'
					|| map.layer[heroGroundY][heroGroundX-1] == 'x'
					|| map.layer[heroGroundY][heroGroundX-1] == 'f') {
                        if (!this.hurt) this.x += this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                                mainguy.wallCollide = false;
                                }, 400);
                        }
				}
				//Left of hero's torso
				if (map.layer[heroGroundY+1][heroGroundX-1] == 'd'
					|| map.layer[heroGroundY+1][heroGroundX-1] == 'x'
					|| map.layer[heroGroundY+1][heroGroundX-1] == 'f') {
						if (!this.hurt) this.x += this.game.clockTick * this.speed;

					  //added in to keep background from moving when colliding with walls
					  if (mainguy.wallCollide == false){
						mainguy.wallCollide = true;
					    setTimeout(function removeFire() {
						  mainguy.wallCollide = false;
						  }, 400);
					    }
				}
				//Left of hero's legs
				if (map.layer[heroGroundY+2][heroGroundX-1] == 'd'
					|| map.layer[heroGroundY+2][heroGroundX-1] == 'x'
					|| map.layer[heroGroundY+2][heroGroundX-1] == 'f') {
                        if (!this.hurt) this.x += this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                              mainguy.wallCollide = false;
                              }, 400);
                        }
				}
				//left of the ground below hero (Need this for special cases)
				if ((map.layer[heroGroundY+3][heroGroundX-1] == 'd'
					|| map.layer[heroGroundY+3][heroGroundX-1] == 'x'
					|| map.layer[heroGroundY+3][heroGroundX-1] == 'f')
					&& this.falling) {
                        if (!this.hurt) this.x += this.game.clockTick * this.speed;

                        //added in to keep background from moving when colliding with walls
                        if (mainguy.wallCollide == false){
                            mainguy.wallCollide = true;
                            setTimeout(function stallWallColide() {
                              mainguy.wallCollide = false;
                              }, 400);
                        }
				}
			  }
			}
		if (this.immune) {
			if (this.isCollide) {
				if (this.collideForward) this.x -= 5;
				else this.x += 5;
			}
        }
        if (this.throwGernade) {
            if (this.grenadeCount > 0) {
                if (this.lookingRight) this.game.addEntity(new gernade(this.game, AM.getAsset("./img/gernade.png"), AM.getAsset("./img/singleGernade.png"),  this.x + 100, this.y - 50, this.lookingRight));
                else this.game.addEntity(new gernade(this.game, AM.getAsset("./img/gernade.png"), AM.getAsset("./img/singleGernade.png"),  this.x, this.y - 50, this.lookingRight));
                this.grenadeCount--;
            }
        }

		if (this.hurt) {
            this.immune = true;
			if (this.hurtCount > 0) {
				if (!this.isCollide) {
					if (this.standForward){
						if (this.collideForward) this.x -= 5;
						else this.x += 5;
					}
					else {
						if (this.collideForward) this.x -= 5;
						else this.x += 5;
					}
				}
				else {
					this.x -= 5;
				}
				this.hurtCount -= 1;
			}
			else {
				this.hurtCount = 6;
				this.hurt = false;
			}
		}
		else if (this.runFlag && this.standForward && (this.standingStance === 2)) {
			if (!this.isCollide) {
			  this.x += this.game.clockTick * this.speed;
			} else {
				if (!this.collideForward) {
				  this.x += this.game.clockTick * this.speed;
				}
			}
		}

		else if ((this.runFlag && !this.standForward && (this.standingStance === 2))) {
			if (!this.isCollide) {
				if (this.x >= 40) {
				  this.x -= this.game.clockTick * this.speed;
				}
			}
			else {
				if (this.collideForward) {
					if (this.x >= 40) {
					  this.x -= this.game.clockTick * this.speed;
					}
				}
			}
		}

		if (this.firing) {


			if (this.CanShoot) {
				if (this.standForward) {
					if (this.jumping) {
						if (this.jumpForward) {
                            if (this.SpreadShotPowerUp) {

                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 95, this.y + 38))

                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 42, this.jumpForward
                                    ,1, true, false, this.unitType, 300, true, this.damage));
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 42, this.jumpForward
                                    ,2, true, false, this.unitType, 300, true, this.damage));
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 42, this.jumpForward
                                    ,3, true, false, this.unitType, 300, true, this.damage));
                            }
                            else {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 95, this.y + 38))
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 42, this.jumpForward
                                    ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                                }

						}
						else {
                            if (this.SpreadShotPowerUp) {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 10, this.y + 35))

                                this.game.addEntity(new Bullet(this.game, this.x - 10 , this.y + 35, this.jumpForward
                                    ,1, true, false, this.unitType, 300, true, this.damage));

                                this.game.addEntity(new Bullet(this.game, this.x - 10 , this.y + 35, this.jumpForward
                                    ,2, true, false, this.unitType, 300, true, this.damage));

                                this.game.addEntity(new Bullet(this.game, this.x - 10 , this.y + 35, this.jumpForward
                                    ,3, true, false, this.unitType, 300, true, this.damage));
                            }
                            else {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 10, this.y + 35))
                                this.game.addEntity(new Bullet(this.game, this.x - 10 , this.y + 35, this.jumpForward
                                    ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                            }
						}
					}
					else if (this.standingStance === 0) {
                        if (this.SpreadShotPowerUp) {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 130, this.y + 80))
                            this.game.addEntity(new Bullet(this.game, this.x + 145, this.y + 85, this.standForward
                                ,3, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x + 145, this.y + 85, this.standForward
                                ,2, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x + 145, this.y + 85, this.standForward
                                ,1, true, false, this.unitType, 300, true, this.damage));
                        }
                        else {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 130, this.y + 80))
                            this.game.addEntity(new Bullet(this.game, this.x + 145, this.y + 85, this.standForward
                                ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                            }
					}
					else if (this.standingStance === 1) {
                        if (this.SpreadShotPowerUp) {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 80, this.y + 56))
                            this.game.addEntity(new Bullet(this.game, this.x + 90, this.y + 61, this.standForward
                                ,1, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x + 90, this.y + 61, this.standForward
                                ,2, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x + 90, this.y + 61, this.standForward
                                ,3, true, false, this.unitType, 300, true, this.damage));
                        }
                        else {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 80, this.y + 56))
                            this.game.addEntity(new Bullet(this.game, this.x + 90, this.y + 61, this.standForward
                            ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                        }
					}
					else {
						if (this.firingStance === 2) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 92, this.y + 31))
                                    this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.standForward
                                        ,1, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.standForward
                                        ,2, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));

                                }
                                else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 92, this.y + 31))
                                    this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 102, this.y + 33))
								this.game.addEntity(new Bullet(this.game, this.x + 120, this.y + 37, this.standForward
									,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}
						else if (this.firingStance === 3) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 70, this.y + 3))
								    this.game.addEntity(new Bullet(this.game, this.x + 100, this.y - 10, this.standForward
                                        ,4, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 100, this.y - 10, this.standForward
                                        ,2, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 100, this.y - 10, this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                }
								else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 70, this.y + 3))
								    this.game.addEntity(new Bullet(this.game, this.x + 100, this.y - 10, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 95, this.y -5))
								this.game.addEntity(new Bullet(this.game, this.x + 122, this.y - 10, this.standForward
								   ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}
						else if (this.firingStance === 1) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 71, this.y + 73))
								    this.game.addEntity(new Bullet(this.game, this.x + 95, this.y + 90, this.standForward
                                        ,1, true, false,this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 95, this.y + 90, this.standForward
                                        ,2, true, false,this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 95, this.y + 90, this.standForward
                                        ,0, true, false,this.unitType, 300, true, this.damage));
                                }
								else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 71, this.y + 73))
								    this.game.addEntity(new Bullet(this.game, this.x + 95, this.y + 90, this.standForward
                                        ,this.firingStance, true, false,this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 95, this.y + 70))
								this.game.addEntity(new Bullet(this.game, this.x + 120, this.y + 87, this.standForward
									,this.firingStance, true, false,this.unitType, 300, true, this.damage));
							}
						}
						else if (this.firingStance === 4) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 30, this.y - 7))
                                    this.game.addEntity(new Bullet(this.game, this.x + 35, this.y - 15, this.standForward
                                        ,4, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 35, this.y - 15, this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 35, this.y - 15, !this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                }
                                else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 30, this.y - 7))
                                    this.game.addEntity(new Bullet(this.game, this.x + 35, this.y - 15, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 50, this.y - 7))
								this.game.addEntity(new Bullet(this.game, this.x + 55, this.y - 15, this.standForward
									,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}

					}
				}
				else {
					if (this.jumping) {
						if (this.jumpForward ) {
                            if (this.SpreadShotPowerUp) {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 110, this.y + 35))
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.jumpForward
                                    ,1, true, false, this.unitType, 300, true, this.damage));
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.jumpForward
                                    ,2, true, false, this.unitType, 300, true, this.damage));
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.jumpForward
                                    ,3, true, false, this.unitType, 300, true, this.damage));
                            }
                            else {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 110, this.y + 35))
                                this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.jumpForward
                                    ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                            }

						}
						else {
                            if  (this.SpreadShotPowerUp) {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 10, this.y + 35))
                                this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 35, this.jumpForward
                                    ,1, true, false, this.unitType, 300, true, this.damage));
                                this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 35, this.jumpForward
                                    ,2, true, false, this.unitType, 300, true, this.damage));
                                this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 35, this.jumpForward
                                    ,3, true, false, this.unitType, 300, true, this.damage));
                            }
                            else {
                                this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 10, this.y + 35))
                                this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 35, this.jumpForward
                                    ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                            }

						}
					}
					else if (this.standingStance === 0) {
                        if (this.SpreadShotPowerUp) {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x, this.y + 80))
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 85, this.standForward
                             ,1, true, false, this.unitType, 300, true, this.damage));
                             this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 85, this.standForward
                                ,2, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 85, this.standForward
                             ,3, true, false, this.unitType, 300, true, this.damage));
                        }
                        else {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x, this.y + 80))
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 85, this.standForward
                             ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                        }

					}
					else if (this.standingStance === 1) {
                        if (this.SpreadShotPowerUp) {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 3, this.y + 55))
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 61, this.standForward
                                ,1, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 61, this.standForward
                                ,3, true, false, this.unitType, 300, true, this.damage));
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 61, this.standForward
                                ,2, true, false, this.unitType, 300, true, this.damage));
                        }
                        else {
                            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 3, this.y + 55))
                            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 61, this.standForward
                             ,this.firingStance, false, false, this.unitType, 300, true, this.damage));
                        }

					}
					else {
						if (this.firingStance === 2) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 2, this.y + 30))
                                    this.game.addEntity(new Bullet(this.game, this.x - 15, this.y + 35, this.standForward
                                        ,2, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x - 15, this.y + 35, this.standForward
                                        ,1, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x - 15, this.y + 35, this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                }
                                else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 2, this.y + 30))
                                    this.game.addEntity(new Bullet(this.game, this.x - 15, this.y + 35, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 15, this.y + 33))
								this.game.addEntity(new Bullet(this.game, this.x - 8 , this.y + 38, this.standForward
									,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}
						else if (this.firingStance === 3) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 10, this.y + 3))
                                    this.game.addEntity(new Bullet(this.game, this.x , this.y - 10, this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x , this.y - 10, this.standForward
                                        ,2, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x , this.y - 10, this.standForward
                                        ,4, true, false, this.unitType, 300, true, this.damage));
                                }
                                else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 10, this.y + 3))
                                    this.game.addEntity(new Bullet(this.game, this.x , this.y - 10, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                }

							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 28, this.y -9))
								this.game.addEntity(new Bullet(this.game, this.x + 18 , this.y - 22, this.standForward
									,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}
						else if (this.firingStance === 1) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 6, this.y + 74))
                                    this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 95, this.standForward
                                        ,1, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 95, this.standForward
                                        ,2, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 95, this.standForward
                                        ,0, true, false, this.unitType, 300, true, this.damage));
                                }
                                else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 6, this.y + 74))
                                    this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 95, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x , this.y + 74))
								this.game.addEntity(new Bullet(this.game, this.x - 8 , this.y + 95, this.standForward
									,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}
						else if (this.firingStance === 4) {
							if (!this.powerUpFire) {
                                if (this.SpreadShotPowerUp) {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 50, this.y - 5))
                                    this.game.addEntity(new Bullet(this.game, this.x + 55, this.y - 15, this.standForward
                                        ,4, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 55, this.y - 15, this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                    this.game.addEntity(new Bullet(this.game, this.x + 55, this.y - 15, !this.standForward
                                        ,3, true, false, this.unitType, 300, true, this.damage));
                                }
                                else {
                                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 50, this.y - 5))
                                    this.game.addEntity(new Bullet(this.game, this.x + 55, this.y - 15, this.standForward
                                        ,this.firingStance, true, false, this.unitType, 300, true, this.damage));
                                    }
							} else {
								this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 70, this.y - 5))
								this.game.addEntity(new Bullet(this.game, this.x + 75, this.y - 15, this.standForward
									,this.firingStance, true, false, this.unitType, 300, true, this.damage));
							}
						}

					}
				}
				this.CanShoot = false;
				if (!this.powerUpRapidFire) {
						setTimeout(function(){
						that.CanShoot = true;
						}, 500);
				} else {
					setTimeout(function(){
						that.CanShoot = true;
						}, 175);
				}
			}
		}
	}
    Entity.prototype.update.call(this);
}

Hero.prototype.draw = function () {
	if (this.dead || !this.game.running) {
		this.game.name.innerHTML = "Last Run 'n Gun Hero";
		this.game.grenades.innerHTML = "";
		this.game.level_num.innerHTML = "";
		return;
	}
	else if (!this.dead || this.game.running) {
		this.game.name.innerHTML = "";
		this.game.grenades.innerHTML = this.grenadeCount;
	}
	
	// THU add -- check if dead and draw health bar
	if (this.dead || !this.game.running) return;

	var i = 0;
	var num = 0;
	this.game.ctx.fillStyle = "red";
	//this.game.ctx.strokeStyle = "Black";

	for (i = 0; i < this.box; i++) {
        this.game.ctx.strokeRect(50 + num, 635, 20, 20);
		this.game.ctx.rect(50 + num, 635, 20, 20);
		num += 20;
        //this.game.ctx.stroke();
	}
	num = 0;
	for (i = 0; i < this.health; i++) {
        this.game.ctx.strokeRect(50 + num, 635, 20, 20);
		this.game.ctx.fillRect(50 + num, 635, 20, 20);
		num += 20;
		//this.game.ctx.stroke();
	}

    //if lightning powerup is on draw the orb above head
    if (this.powerUpLightning == true) {
        this.lightningOrb.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX +25 , this.y + cameraY -50, .75);
    }

    if (this.hurt) {
        if (this.standForward) this.frontDamageHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX , this.y + cameraY);
        else this.backDamageHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX , this.y + cameraY);
    }
    else if ((this.jumping || this.falling) && this.standForward) { //&& this.jumpForward
        if (!this.powerUpFire) {
            this.frontJump.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
        } else {
            this.flameFrontJump.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
        }
    }
    else if ((this.jumping || this.falling) && !this.standForward) { // && !this.jumpForward
        if (!this.powerUpFire) {
            this.backJump.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
        } else {
            this.flameBackJump.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
        }
    }
    else if (this.hurt) {
        if (this.standForward) this.frontDamageHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX , this.y + cameraY);
        else this.backDamageHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX , this.y + cameraY);
    }
    else if (this.standingStance === 0 && this.standForward) {
        if (!this.powerUpFire) {
            this.frontCrawl.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
        } else {
            this.flameFrontCrawl.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY +23, .65);
        }
    }
    else if (this.standingStance === 1 && this.standForward) {
        if (!this.powerUpFire) {
            this.frontCrouchHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY + 20);
        } else {
            this.flameFrontCrouchHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY + 10);
        }
    }
    else if (this.standingStance === 1 && !this.standForward) {
        if (!this.powerUpFire) {
            this.backCrouchHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY + 20);
        } else {
            this.flameBackCrouchHero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY + 10);
        }
    }
    else if (this.standingStance === 0 && !this.standForward) {
        if (!this.powerUpFire) {
            this.backCrawl.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
        } else {
            this.flameBackCrawl.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY +23, .65);
        }
    }
    else if (this.firingStance === 2) {
        if (this.runFlag && this.standForward) {
            if (!this.powerUpFire) {
                this.frontRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFrontRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (this.runFlag && !this.standForward) {
            if (!this.powerUpFire) {
                this.backRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBackRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (!this.runFlag && this.standForward) {
            if (!this.powerUpFire) {
                this.frontStand.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFrontStand.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (!this.runFlag && !this.standForward) {
            if (!this.powerUpFire) {
                this.backStand.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBackStand.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
    }
    else if (this.firingStance === 3) {
        if (this.runFlag && this.standForward) {
            if (!this.powerUpFire) {
                this.front45UpRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFront45UpRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (this.runFlag && !this.standForward) {
            if (!this.powerUpFire) {
                this.back45UpRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBack45UpRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (!this.runFlag && this.standForward) {
            if (!this.powerUpFire) {
                this.front45Up.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFront45Up.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (!this.runFlag && !this.standForward) {
            if (!this.powerUpFire) {
                this.back45Up.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBack45Up.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
    }
    else if (this.firingStance === 1) {
        if (this.runFlag && this.standForward) {
            if (!this.powerUpFire) {
                this.front45DownRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFront45DownRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (this.runFlag && !this.standForward) {
            if (!this.powerUpFire) {
                this.back45DownRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBack45DownRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (!this.runFlag && this.standForward) {
            if (!this.powerUpFire) {
                this.front45Down.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFront45Down.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
        else if (!this.runFlag && !this.standForward) {
            if (!this.powerUpFire) {
                this.back45Down.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBack45Down.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -15, .65);
            }
        }
    }
    else if (this.firingStance === 0) {
        if (this.standForward) {
            if (!this.powerUpFire) {
                this.frontDown90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFrontDown90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -10);
            }
        }
        else {
            if (!this.powerUpFire) {
                this.backDown90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBackDown90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -10);
            }
        }
    }
    else if (this.firingStance === 4) {
        if (this.standForward) {
            if (!this.powerUpFire) {
                this.frontUp90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameFrontUp90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -10);
            }
        }
        else {
            if (!this.powerUpFire) {
                this.backUp90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
            } else {
                this.flameBackUp90Hero.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY -10);
            }
        }
    }
    Entity.prototype.draw.call(this);
}


function EnemySoldier(game, backRunSprite, frontRunSprite, backStandSprite, frontStandSprite
    , frontCrouchSprite, backCrouchSprite,  xCord, yCord, unitSpeed, health, scores, radius, sight) {
    this.enemyBackRun = new Animation(backRunSprite, this.x, this.y, 102, 100, 8, 0.1, 8, true);
    this.enemyFrontRun = new Animation(frontRunSprite, this.x, this.y, 104, 100, 8, 0.1, 8, true);
    this.enemyBackStand = new Animation(backStandSprite, this.x, this.y, 98, 100, 1, 0.1, 1, true);
    this.enemyFrontStand = new Animation(frontStandSprite, this.x, this.y, 98, 100, 1, 0.1, 1, true);
    this.enemyBackCrouch = new Animation(frontCrouchSprite, this.x, this.y, 98, 80, 1, 0.1, 1, true);
    this.enemyFrontCrouch = new Animation(backCrouchSprite, this.x, this.y, 98, 80, 1, 0.1, 1, true);
    this.speed = unitSpeed;
    this.sight = sight;
    this.health = health;
    this.ctx = game.ctx;
    this.radius = radius;
    this.damage = 1;
    this.forward = true;
    this.crouch = false;
    this.unitType = "soldier";
    this.width = 85;
    this.height = 90;
    this.timer = 0;
    this.enemy = true;
    this.enemyShoot = true;
    this.standing = false;
    this.center = xCord;
	this.scores = scores;
    Entity.call(this, game, xCord, yCord);
}

EnemySoldier.prototype = new Entity();
EnemySoldier.prototype.constructor = EnemySoldier;


EnemySoldier.prototype.reset = function () {
	this.forward = true;
	this.crouch = false;
	this.enemyShoot = true;
	this.standing = false;
}

EnemySoldier.prototype.update = function () {
    var enemyThat = this;
    this.isCollide = false;
    this.collideForward = false;
    if (this.health <= 0) this.isDead = true;
    if (this.isDead) {
		this.game.entities[2].scores += this.scores;				 // Thu added
		this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        gameEngine.removeEntity(this);
        ///////////////////////////////////////////
        ///// Buff Drops everytime right now //////
        ///////////////////////////////////////////
        //Change the '* 1' inside the Math.random//
        /// to '* 10' to make it a 1/10th chance //
        ///////////////////////////////////////////
        var powerUpChance = Math.floor(Math.random() * 8) +1 ; //Generates a random number between 1-10
        if (powerUpChance === 1) {
            gameEngine.addPowerUp(new FirePowerUp(gameEngine,
                AM.getAsset("./img/firepowerup.png"), this.x, this.y - 50));
        } else if (powerUpChance === 2) {
            gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
                AM.getAsset("./img/heart.png"), this.x, this.y -50));
        } else if (powerUpChance === 3) {
            gameEngine.addPowerUp(new RapidFirePowerUp(gameEngine,
                AM.getAsset("./img/gattling.png"), this.x, this.y -50));
        } else if (powerUpChance === 4) {
            gameEngine.addPowerUp(new lightningPowerUp(gameEngine,
                AM.getAsset("./img/LightningOrbs.png"), this.x, this.y -50));
        }
        else if (powerUpChance === 5) {
            gameEngine.addPowerUp(new DoubleDamagePowerUp(gameEngine,
                AM.getAsset("./img/Chieftain_Pump_Shotgun_icon.png"), this.x, this.y -50));
        }
        else if (powerUpChance === 6) {
            gameEngine.addPowerUp(new SpreadShotPowerUp(gameEngine,
                AM.getAsset("./img/triple.png"), this.x, this.y -50));
        }
        else if (powerUpChance === 7) {
            gameEngine.addPowerUp(new GrenadePowerUp(gameEngine,
                AM.getAsset("./img/grenade.png"), this.x, this.y -50));
        }
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && collide(this, ent)) {
            this.isCollide = true;

            if (this.x < ent.x) this.collideForward = true;
        }
    }
    if (this.isCollide) {
        if (this.collideForward) this.forward = false;
        else this.forward = true;
    }
    if ((Math.abs(this.x - this.game.entities[2].x) >= this.sight )) this.standing = false;
    if (Math.abs(this.x - this.game.entities[2].x) <= this.sight ) {
        this.timer += this.game.clockTick;
        if (this.timer >= 10 || this.timer === 0) {
            this.timer = 0;
            if (this.game.entities[2].standingStance === 1) {
                this.crouch = true;
                this.height = 40;
            }
            else if (Math.floor((Math.random() * 2) + 1) === 1) {
                this.crouch = true;
                this.height = 40;
            }
            else {
                this.crouch = false;
                this.height = 100;
            }
        }
        this.standing = true;
        if (this.x - this.game.entities[2].x < 0) this.forward = true;
        else this.forward = false;
        if (this.enemyShoot) {
            if (this.forward) {
                if (this.crouch) {
                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 85, this.y + 55))
                    this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 60
                        , this.forward,this.firingStance, false, false, this.unitType, 300, false, this.damage));
                }
                else {
                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 85, this.y + 32))
                    this.game.addEntity(new Bullet(this.game, this.x + 110, this.y + 35, this.forward
                        ,this.firingStance, false, false, this.unitType, 300, false, this.damage));
                }
            }
            else
                if (this.crouch) {
                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 1, this.y + 55))
                    this.game.addEntity(new Bullet(this.game, this.x -15, this.y + 60, this.forward
                        ,this.firingStance, false, false, this.unitType, 300, false, this.damage));
                }
                else {
                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 1, this.y + 32))
                    this.game.addEntity(new Bullet(this.game, this.x - 15, this.y + 35, this.forward,this.firingStance, false
                        , false, this.unitType, 300, false, this.damage));
                }
            this.enemyShoot = false;
            setTimeout(function(){
            enemyThat.enemyShoot = true;
        }, 900);
        }
    }
    else if (this.forward && (this.x - this.center < this.radius)){
        if (!this.isCollide) this.x += this.game.clockTick * this.speed;
        else {
            if(!this.collideForward) this.x += this.game.clockTick * this.speed;
        }
    }
    else if (((this.x - this.center) >= this.radius) && this.forward) {
        if (!this.isCollide) this.x -= this.game.clockTick * this.speed;
        else {
            if(this.collideForward) this.x -= this.game.clockTick * this.speed;
        }
        this.forward = false;
    }
    else if (!this.forward && (this.x - this.center > -(this.radius))) {
        if (!this.isCollide) this.x -= this.game.clockTick * this.speed;
            else {
                if(!this.collideForward) this.x -= this.game.clockTick * this.speed;
            }
        }
    else if (((this.x - this.center) <= -(this.radius)) && !this.forward) {
        if (!this.isCollide) this.x += this.game.clockTick * this.speed;
        else {
            if(!this.collideForward) this.x += this.game.clockTick * this.speed;
        }
        this.forward = true;
    }
    Entity.prototype.update.call(this);
}

EnemySoldier.prototype.draw = function () {
	if (!this.game.running) return;
    if (this.forward) {
        if (this.standing) {
            if (this.crouch) this.enemyBackCrouch.drawFrame(this.game.clockTick, this.ctx
                , this.x - cameraX, this.y + cameraY + 20);
            else this.enemyFrontStand.drawFrame(this.game.clockTick, this.ctx
                , this.x - cameraX, this.y + cameraY);
        }
        else this.enemyFrontRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    }
    else {
        if (this.standing) {
            if (this.crouch) this.enemyFrontCrouch.drawFrame(this.game.clockTick, this.ctx
                , this.x - cameraX, this.y + cameraY + 20);
            else this.enemyBackStand.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
        }
        else this.enemyBackRun.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY );
    }
    Entity.prototype.draw.call(this);
}

function Robot(game, backRunSprite, frontRunSprite, xCord, yCord, unitSpeed, health, unitType, scores, radius, sight) {
    this.robotBackRun = new Animation(backRunSprite, this.x, this.y, 51, 49, 3, 0.1, 3, true);
    this.robotFrontRun = new Animation(frontRunSprite, this.x, this.y, 51, 49, 3, 0.1, 3, true);
    this.speed = unitSpeed;
    this.health = health;
    this.ctx = game.ctx;
    this.width = 40;
    this.radius = radius;
    this.sight = sight;
    this.unitType = unitType;
    this.enemy = true;
    this.ground = 500;
    this.jumping = false;
    this.falling = false;
    this.height = 36;
    this.forward = true;
    this.center = xCord;
	this.scores = scores;
    Entity.call(this, game, xCord, yCord);
}

Robot.prototype = new Entity();
Robot.prototype.constructor = Robot;

Robot.prototype.reset = function () {
	this.enemy = true;
	this.forward = true;
}

Robot.prototype.update = function () {
    this.isCollide = false;
    this.collideForward = false;
    if (this.health <= 0 && this.unitType !== "blueRobot") this.isDead = true;

    if (this.isDead) {
		this.game.entities[2].scores += this.scores;
        this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        if (this.unitType === "redRobot") {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent !== this && (Math.abs(this.x - ent.x) <= 200)) {
                    if (Math.abs(ent.y - this.y) <= 200 ) {
                        if (ent.hero) {
                            if (!ent.immune) ent.health -= 4;
                        }
                        else {
                            ent.health -= 4;
                        }

                    }
                }
            }

        this.game.addEntity(new robotFlash(this.game, AM.getAsset("./img/robotFlash.png"),  this.x - 180, this.y - 180));
        }
        if (this.unitType !== "blueRobot") {
            gameEngine.removeEntity(this);

            ///////////////////////////////////////////
            ///// Buff Drops everytime right now //////
            ///////////////////////////////////////////
            //Change the '* 1' inside the Math.random//
            /// to '* 10' to make it a 1/10th chance //
            ///////////////////////////////////////////
            var powerUpChance = Math.floor(Math.random() * 8) +1 ; //Generates a random number between 1-10
            if (powerUpChance === 1) {
                gameEngine.addPowerUp(new FirePowerUp(gameEngine,
                    AM.getAsset("./img/firepowerup.png"), this.x, this.y - 75));
            } else if (powerUpChance === 2) {
                gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
                    AM.getAsset("./img/heart.png"), this.x, this.y -75));
            } else if (powerUpChance === 3) {
                gameEngine.addPowerUp(new RapidFirePowerUp(gameEngine,
                    AM.getAsset("./img/gattling.png"), this.x, this.y -50));
            } else if (powerUpChance === 4) {
                gameEngine.addPowerUp(new lightningPowerUp(gameEngine,
                    AM.getAsset("./img/LightningOrbs.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 5) {
                gameEngine.addPowerUp(new DoubleDamagePowerUp(gameEngine,
                    AM.getAsset("./img/Chieftain_Pump_Shotgun_icon.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 6) {
                gameEngine.addPowerUp(new SpreadShotPowerUp(gameEngine,
                    AM.getAsset("./img/triple.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 7) {
                gameEngine.addPowerUp(new GrenadePowerUp(gameEngine,
                    AM.getAsset("./img/grenade.png"), this.x, this.y -50));
            }
        }
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var robotGroundX = Math.round(this.x/25) + 1;
        var robotGroundY = Math.round(this.y/25);
        // if (ent.hero && (Math.abs(ent.x - this.x) < 50) && this.unitType === "greenRobot" && !this.jumping ) {
        //     this.jumping = true;
        // }
        // if (this.jumping || this.falling) {
        //     //this.gernadeThrow.elapsedTime = 0;
        //   }
        //   //### Start ##############################################################

        //   //This makes the hero go up if he jumps and once he gets to the top he falls
        //   if (this.jumping) {
        //     if (map.layer[robotGroundY-1][robotGroundX] == 's'
        //         || map.layer[robotGroundY-1][robotGroundX] == 'b'
        //         || map.layer[robotGroundY-1][robotGroundX] == 'f') {
        //       this.jumping = false;
        //       this.falling = true;
        //     } else {
        //       if (this.game.timer.gameTime <= this.spaceTime) {
        //         this.y = this.y - 7;
        //         this.falling = false;
        //       } else {
        //         this.falling = true;
        //         this.jumping = false;
        //       }
        //     }
        //   }

        //   //If there is no platform right below hero, start falling
        //   if (!this.jumping && !(map.layer[robotGroundY +1][robotGroundX] == 'v'
        //       || map.layer[robotGroundY +1][robotGroundX] == 'a'
        //       || map.layer[robotGroundY +1][robotGroundX] == 'd')) {
        //     this.falling = true;
        //   }

        //   //If hero is falling
        //   if (this.falling) {
        //     //If there is a floor below the hero make it that the hero is not falling or jumping

        //     if (map.layer[robotGroundY +1 ][robotGroundX] == 'v'
        //         || map.layer[robotGroundY +1][robotGroundX] == 'a'
        //         || map.layer[robotGroundY +1][robotGroundX] == 'd') {
        //          this.falling = false;
        //          this.jumping = false;
        //          //Since I'm rounding the hero always land 10 pixels to early so I added some hard code.
        //          this.y += 10 //this only happens once
        //     } else {
        //       //if there is do platform below hero fall down, sum amount of pixels
        //       if (this.falling) {
        //         this.y += 10;
        //       }
        //     }
        // }
        if (ent !== this && collide(this, ent)) {
            if (!ent.isBullet) {
                this.isCollide = true;
                if (this.x < ent.x) this.collideForward = true;
            }
        }


    }

    if (this.isCollide) {
        if (this.collideForward) this.forward = false;
        else this.forward = true;
    }
    if (this.forward && (this.x - this.center < this.radius))
        if (!this.isCollide) {
            this.x += this.game.clockTick * this.speed;
        }
        else {
            if (!this.collideForward){
                this.x += this.game.clockTick * this.speed;
            }
        }
    else if (((this.x - this.center) >= this.radius) && this.forward) {
        if (!this.isCollide) {
            this.x -= this.game.clockTick * this.speed;
        }
        else {
            if (this.collideForward){
                this.x -= this.game.clockTick * this.speed;
            }
        }
        this.forward = false;
    }
    else if (!this.forward && (this.x - this.center > -(this.radius))) {
        if (!this.isCollide) {
            this.x -= this.game.clockTick * this.speed;
        }
        else {
            if (this.collideForward){
                this.x -= this.game.clockTick * this.speed;
            }
        }
    }
    else if (((this.x - this.center) <= -(this.radius)) && !this.forward && !this.isCollide) {
        if (!this.isCollide) {
            this.x += this.game.clockTick * this.speed;
        }
        else {
            if (!this.collideForward){
                this.x += this.game.clockTick * this.speed;
            }
        }
        this.forward = true;
    }
    Entity.prototype.update.call(this);
}

Robot.prototype.draw = function () {
	if (!this.game.running) return;
    if (this.forward) this.robotFrontRun.drawFrame(this.game.clockTick, this.ctx
        , this.x - cameraX, this.y + cameraY);
    else if (!this.forward) this.robotBackRun.drawFrame(this.game.clockTick, this.ctx
        , this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function robotFlash(game, robotFlashSprite, xCord, yCord) {
    this.robotActiveFlash = new Animation(robotFlashSprite, this.x, this.y, 400, 400, 1, 0.3, 1, false);
    isDead = false;
    this.ctx = game.ctx;
    Entity.call(this, game, xCord, yCord);
}

robotFlash.prototype = new Entity();
robotFlash.prototype.constructor = robotFlash;

robotFlash.prototype.reset = function () {

}

robotFlash.prototype.update = function () {
    if (this.isDead) this.removeFromWorld = true;
    enemyThat = this;
    if (this.isDead) this.removeFromWorld = true;
    setTimeout(function(){
        enemyThat.isDead = true;
    }, 500);
    Entity.prototype.update.call(this);
}

robotFlash.prototype.draw = function () {
	if (!this.game.running) return;
    this.robotActiveFlash.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function landMine(game, landMineSprite,  xCord, yCord, health, scores) {
    this.landMineActive = new Animation(landMineSprite, this.x, this.y, 22.79, 20, 4, 0.1, 4, true);
    this.ctx = game.ctx;
    this.width = 22;
    this.health = health;
    this.unitType = "landMine";
    this.landMine = true;
    this.enemy = true;
    this.isDead = false;
    this.height = 15;
    this.center = xCord;
	this.scores = scores;
    Entity.call(this, game, xCord, yCord);
}

landMine.prototype = new Entity();
landMine.prototype.constructor = landMine;

landMine.prototype.reset = function () {
	this.landMine = true;
	this.enemy = true;
	this.isDead = false;
}


landMine.prototype.update = function () {
    var enemyThat = this;
    this.isCollide = false;
    if (this.health <= 0) this.isDead = true;
    if (this.isDead) {
		this.game.entities[2].scores += this.scores;
        this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        this.removeFromWorld = true;
        this.game.addEntity(new landMineFlash(this.game, AM.getAsset("./img/landMineFlash.png"),  this.x - 5, this.y - 10));
    }
    this.collideForward = false;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && collide(this, ent)) {
            this.isCollide = true;
            if (this.x < ent.x) this.collideForward = true;
        }
    }

    Entity.prototype.update.call(this);
}

landMine.prototype.draw = function () {
	if (!this.game.running) return;
    this.landMineActive.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function gernade(game, gernadeSprite, gernadeSprite1,  xCord, yCord, forward) {
    this.gernadeLive = new Animation(gernadeSprite, this.x, this.y, 32, 64, 13, 0.1, 13, false);
    this.gernadeThrow = new Animation(gernadeSprite1, this.x, this.y, 32, 64, 1, 1, 1, false);
    this.ctx = game.ctx;
    this.width = 22;
    this.speed = 1000;
    this.ground = 500;
    this.jumping = true;
    this.unitType = "gernade";
    this.gernade = true;
    this.isDead = false;
    this.falling = false;
    this.active = false;
    this.forward = forward;
    this.spaceTime = game.timer.gameTime + 0.3;
    this.time = 10;
    this.height = 15;
    this.center = xCord;
    Entity.call(this, game, xCord, yCord);
}

gernade.prototype = new Entity();
gernade.prototype.constructor = gernade;

gernade.prototype.reset = function () {
	this.gernade = true;
	this.isDead = false;
}


gernade.prototype.update = function () {
    var enemyThat = this;
    this.isCollide = false;

    var gernadeGroundX = Math.round(this.x/25) + 1;
    var gernadeGroundY = Math.round(this.y/25);
    if (!this.falling && !this.jumping) {
        this.active = true;
    }

    if (!this.active) {
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent !== this && collide(this, ent)) {

                for (var i = 0; i < this.game.entities.length; i++) {
                    var ent = this.game.entities[i];

                    if (ent !== this && (Math.abs(this.x - ent.x) <= 200)) {
                        if (Math.abs(ent.y - this.y) <= 200 ) {
                            if (ent.hero && !ent.immune) {
                                ent.health -= 4;
                            }
                            else {
                                ent.health -= 4;
                            }

                        }
                    }
                }
                this.game.addEntity(new robotFlash(this.game, AM.getAsset("./img/robotFlash.png"),  this.x - 180, this.y - 180));
                this.removeFromWorld = true;
            }
        }

        if (this.jumping || this.falling) {
            this.gernadeThrow.elapsedTime = 0;
          }
          //### Start ##############################################################

          //This makes the hero go up if he jumps and once he gets to the top he falls
          if (this.jumping) {
            if (map.layer[gernadeGroundY-1][gernadeGroundX] == 's'
                || map.layer[gernadeGroundY-1][gernadeGroundX] == 'b'
                || map.layer[gernadeGroundY-1][gernadeGroundX] == 'f') {
              this.jumping = false;
              this.falling = true;
            } else {
              if (this.game.timer.gameTime <= this.spaceTime) {
                this.y = this.y - 7;
                this.falling = false;
              } else {
                this.falling = true;
                this.jumping = false;
              }
            }
          }

          //If there is no platform right below hero, start falling
          if (!this.jumping && !(map.layer[gernadeGroundY +1][gernadeGroundX] == 'v'
              || map.layer[gernadeGroundY +1][gernadeGroundX] == 'a'
              || map.layer[gernadeGroundY +1][gernadeGroundX] == 'd')) {
            this.falling = true;
          }

          //If hero is falling
          if (this.falling) {
            //If there is a floor below the hero make it that the hero is not falling or jumping

            if (map.layer[gernadeGroundY +1 ][gernadeGroundX] == 'v'
                || map.layer[gernadeGroundY +1][gernadeGroundX] == 'a'
                || map.layer[gernadeGroundY +1][gernadeGroundX] == 'd') {
                 this.falling = false;
                 this.jumping = false;
                 //Since I'm rounding the hero always land 10 pixels to early so I added some hard code.
                 this.y += 10 //this only happens once
            } else {
              //if there is do platform below hero fall down, sum amount of pixels
              if (this.falling) {
                this.y += 10;
              }
            }
        }
        if (this.forward) {
            this.x += (this.game.clockTick * this.speed ) / 2;
        }
        else {
            if (this.x > 60) this.x -= (this.game.clockTick * this.speed ) / 2;
        }

    }
    else {
        if (this.gernadeLive.isDone()) {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent !== this && (Math.abs(this.x - ent.x) <= 200)) {
                    if (Math.abs(ent.y - this.y) <= 200 ) {
                        if (ent.hero && !ent.immune) {
                            ent.health -= 3;
                        }
                        else {
                            ent.health -= 3;
                        }

                    }
                }
            }
            this.game.addEntity(new robotFlash(this.game, AM.getAsset("./img/robotFlash.png"),  this.x - 180, this.y - 180));
            this.removeFromWorld = true;
        }
    }
    Entity.prototype.update.call(this);
}

gernade.prototype.draw = function () {
    if (!this.game.running) return;
    if (this.active) this.gernadeLive.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    else this.gernadeThrow.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function landMineFlash(game, landMineFlashSprite, xCord, yCord) {
    this.landMineFlashActive = new Animation(landMineFlashSprite, this.x, this.y, 42, 43, 1, 0.3, 1, false);
    this.ctx = game.ctx;
    this.unitType = "flash";
    Entity.call(this, game, xCord, yCord);
}

landMineFlash.prototype = new Entity();
landMineFlash.prototype.constructor = landMineFlash;

landMineFlash.prototype.reset = function () {
}

landMineFlash.prototype.update = function () {
    if (this.isDead) this.removeFromWorld = true;
    enemyThat = this;
    if (this.isDead) this.removeFromWorld = true;
    setTimeout(function(){
        enemyThat.isDead = true;
    }, 500);
    Entity.prototype.update.call(this);
}

landMineFlash.prototype.draw = function () {
	if (!this.game.running) return;
    this.landMineFlashActive.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);

}

function bulletFlash(game, bulletFlashSprite, xCord, yCord) {
    this.bulletFlashActive = new Animation(bulletFlashSprite, this.x, this.y, 11, 11, 1, 0.1, 1, false);
    this.ctx = game.ctx;
    this.isDead = false;
    this.unitType = "flash";
    Entity.call(this, game, xCord, yCord);
}

bulletFlash.prototype = new Entity();
bulletFlash.prototype.constructor = bulletFlash;

bulletFlash.prototype.reset = function () {
}


bulletFlash.prototype.update = function () {
    enemyThat = this;
    if (this.isDead) this.removeFromWorld = true;
    setTimeout(function(){
        enemyThat.isDead = true;
    }, 500);
    Entity.prototype.update.call(this);
}

bulletFlash.prototype.draw = function () {
	if (!this.game.running) return;
    this.bulletFlashActive.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function GunTurrent(game, firingGunSprite,idleGunSprite,  xCord, yCord, health, scores, sight) {
    this.gunTurrentIdle = new Animation(idleGunSprite, this.x, this.y, 63, 60, 2, 0.1, 2, true);
    this.gunTurrentFiring = new Animation(firingGunSprite, this.x, this.y, 61, 60, 4, 0.6, 4, true);
    this.health = health;
    this.ctx = game.ctx;
    this.width = 50;
    this.sight = sight;
    this.health = health;
    this.damage = 1;
    this.unitType = "turrent";
    this.gunTurrent = true;
    this.enemy = true;
    this.isDead = false;
    this.enemyShoot = true;
    this.height = 60;
    this.active = true;
    this.center = xCord;
	this.scores = scores;
    //this.bulletDist = bulletDist;
    Entity.call(this, game, xCord, yCord);
}

GunTurrent.prototype = new Entity();
GunTurrent.prototype.constructor = GunTurrent;

GunTurrent.prototype.reset = function () {
	this.gunTurrent = true;
    this.enemy = true;
    this.isDead = false;
    this.enemyShoot = true;
    this.active = true;
}

GunTurrent.prototype.update = function () {
    var enemyThat = this;
    this.isCollide = false;
    this.collideForward = false;
    if (this.health <= 0) this.isDead = true;
    if (this.isDead) {
		this.game.entities[2].scores += this.scores;
		this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        this.removeFromWorld = true;

        ///////////////////////////////////////////
        ///// Buff Drops everytime right now //////
        ///////////////////////////////////////////
        //Change the '* 1' inside the Math.random//
        /// to '* 10' to make it a 1/10th chance //
        ///////////////////////////////////////////
        var powerUpChance = Math.floor(Math.random() * 8) +1 ; //Generates a random number between 1-10

            if (powerUpChance === 1) {
                gameEngine.addPowerUp(new FirePowerUp(gameEngine,
                    AM.getAsset("./img/firepowerup.png"), this.x, this.y - 75));
            } else if (powerUpChance === 2) {
                gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
                    AM.getAsset("./img/heart.png"), this.x, this.y -75));
            } else if (powerUpChance === 3) {
                gameEngine.addPowerUp(new RapidFirePowerUp(gameEngine,
                    AM.getAsset("./img/gattling.png"), this.x, this.y -50));
            } else if (powerUpChance === 4) {
                gameEngine.addPowerUp(new lightningPowerUp(gameEngine,
                    AM.getAsset("./img/LightningOrbs.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 5) {
                gameEngine.addPowerUp(new DoubleDamagePowerUp(gameEngine,
                    AM.getAsset("./img/Chieftain_Pump_Shotgun_icon.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 6) {
                gameEngine.addPowerUp(new SpreadShotPowerUp(gameEngine,
                    AM.getAsset("./img/triple.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 7) {
                gameEngine.addPowerUp(new GrenadePowerUp(gameEngine,
                    AM.getAsset("./img/grenade.png"), this.x, this.y -50));
            }
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && collide(this, ent)) {
            this.isCollide = true;
            if (this.x < ent.x) this.collideForward = true;
        }
    }
    if (Math.abs(this.x - this.game.entities[2].x) <= this.sight ) {
        this.active = true;
        if(this.x - this.game.entities[2].x > 0) this.active = true;
        else this.active = false;
        if (this.enemyShoot && this.active) {
            this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x - 5, this.y + 25))
            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 30, this.forward
                ,this.firingStance, false, false, this.unitType, 300, false, this.damage));
            this.enemyShoot = false;
            setTimeout(function(){
            enemyThat.enemyShoot = true;
        }, 1300);
        }
    }
    else this.active = false;

    Entity.prototype.update.call(this);
}

GunTurrent.prototype.draw = function () {
	if (!this.game.running) return;
    if (this.active) this.gunTurrentFiring.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    else this.gunTurrentIdle.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function GiantRobot(game, firingGunSprite,idleGunSprite,  xCord, yCord, health, scores, sight) {
    this.gunTurrentIdle = new Animation(idleGunSprite, this.x, this.y, 257, 200, 1, 0.1, 1, true);
    this.gunTurrentFiring = new Animation(firingGunSprite, this.x, this.y, 265, 200, 2, 0.5, 2, true);
    this.health = health;
    this.ctx = game.ctx;
    this.sight = sight;
    this.damage = 1;
    this.unitType = "giantRobot";
    this.width = 200;
    this.gunTurrent = true;
    this.enemy = true;
    this.isDead = false;
    this.enemyShoot = true;
    this.height = 200;
    this.active = true;
    this.center = xCord;
	this.scores = scores;
    Entity.call(this, game, xCord, yCord);
}

GiantRobot.prototype = new Entity();
GiantRobot.prototype.constructor = GiantRobot;

GiantRobot.prototype.reset = function () {
	this.gunTurrent = true;
    this.enemy = true;
    this.isDead = false;
    this.enemyShoot = true;
    this.active = true;
}


GiantRobot.prototype.update = function () {
    var enemyThat = this;
    this.isCollide = false;
    this.collideForward = false;
    if (this.health <= 0) this.isDead = true;
    if (this.isDead) {
		this.game.entities[2].scores += this.scores;
		this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        this.removeFromWorld = true;

        //drops 3 lives when killed
        gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
            AM.getAsset("./img/heart.png"), this.x, this.y));
        gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
            AM.getAsset("./img/heart.png"), this.x - 60 , this.y));
        gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
            AM.getAsset("./img/heart.png"), this.x + 60 , this.y));
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && collide(this, ent)) {
            this.isCollide = true;
            if (this.x < ent.x) this.collideForward = true;
        }
    }
    if (Math.abs(this.x - this.game.entities[2].x) <= this.sight ) {
        this.active = true;
        if(this.x - this.game.entities[2].x > 0) this.active = true;
        else this.active = false;
        if (this.enemyShoot && this.active) {
            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 80, this.forward

                ,this.firingStance, false,false, this.unitType, 250, false, this.damage));

            this.game.addEntity(new landMineFlash(this.game, AM.getAsset("./img/landMineFlash.png"),  this.x - 12, this.y + 60));

            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 80, this.forward

                , 3, true,false, this.unitType, 300, false, this.damage));

            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 80, this.forward

                , 1, true,false, this.unitType, 150, false, this.damage));

            this.enemyShoot = false;
            setTimeout(function(){
            enemyThat.enemyShoot = true;
        }, 1300);

        }
    }
    else this.active = false;

    Entity.prototype.update.call(this);
}

GiantRobot.prototype.draw = function () {
	if (!this.game.running) return;
    if (this.active) this.gunTurrentFiring.drawFrame(this.game.clockTick, this.ctx
        , this.x - cameraX, this.y + cameraY);
    else this.gunTurrentIdle.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}

function FinalBoss(game, firingGunSprite,idleGunSprite,  xCord, yCord, health, scores, sight) {
    this.gunTurrentIdle = new Animation(idleGunSprite, this.x, this.y, 514, 400, 1, 0.1, 1, true);
    this.gunTurrentFiring = new Animation(firingGunSprite, this.x, this.y, 529, 400, 2, 0.5, 2, true);
    this.health = health;
    this.ctx = game.ctx;
    this.sight = sight;
    this.damage = 3;
    this.unitType = "finalBoss";
    this.width = 200;
    this.gunTurrent = true;
    this.enemy = true;
    this.isDead = false;
    this.enemyShoot = true;
    this.height = 200;
    this.active = true;
    this.center = xCord;
	this.scores = scores;
    Entity.call(this, game, xCord, yCord);
}

FinalBoss.prototype = new Entity();
FinalBoss.prototype.constructor = FinalBoss;

FinalBoss.prototype.reset = function () {
	this.gunTurrent = true;
    this.enemy = true;
    this.isDead = false;
    this.enemyShoot = true;
    this.active = true;
}


FinalBoss.prototype.update = function () {
    var enemyThat = this;
    this.isCollide = false;
    this.collideForward = false;
    if (this.health <= 0) this.isDead = true;
    if (this.isDead) {
		this.game.entities[2].scores += this.scores;
		this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        this.removeFromWorld = true;

        //drops 3 lives when killed
        gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
            AM.getAsset("./img/heart.png"), this.x, this.y));
        gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
            AM.getAsset("./img/heart.png"), this.x - 60 , this.y));
        gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
            AM.getAsset("./img/heart.png"), this.x + 60 , this.y));
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && collide(this, ent)) {
            this.isCollide = true;
            if (this.x < ent.x) this.collideForward = true;
        }
    }
    if (Math.abs(this.x - this.game.entities[2].x) <= this.sight ) {
        this.active = true;
        if(this.x - this.game.entities[2].x > 0) this.active = true;
        else this.active = false;
        if (this.enemyShoot && this.active) {
            this.game.addEntity(new landMineFlash(this.game, AM.getAsset("./img/landMineFlash.png"),  this.x - 12, this.y + 170));
            this.game.addEntity(new Bullet(this.game, this.x - 10, this.y + 190, this.forward
                , 0, true,false, this.unitType, 150, false, this.damage));
            this.enemyShoot = false;
            setTimeout(function(){
            enemyThat.enemyShoot = true;
        }, 1400);

        }
    }
    else this.active = false;

    Entity.prototype.update.call(this);
}

FinalBoss.prototype.draw = function () {
	if (!this.game.running) return;
    if (this.active) this.gunTurrentFiring.drawFrame(this.game.clockTick, this.ctx
        , this.x - cameraX, this.y + cameraY);
    else this.gunTurrentIdle.drawFrame(this.game.clockTick, this.ctx, this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);
}


function FlyingRobot(game, backRunSprite, frontRunSprite, xCord, yCord, unitSpeed, health, scores, radius, sight) {
    this.flyingRobotBackRun = new Animation(backRunSprite, this.x, this.y, 52, 50, 2, 0.1, 2, true);
    this.flyingRobotFrontRun = new Animation(frontRunSprite, this.x, this.y, 53, 50, 2, 0.1, 2, true);
    this.speed = unitSpeed;
    this.height = 50;
    this.width = 52;
    this.radius = radius;
    this.sight = sight;
    this.damage = 1;
    this.enemy = true;
    this.unitType = "flyingRobot";
    this.ctx = game.ctx;
    this.health = health;
    this.forward = true;
    this.heroInRange = false;
    this.enemyShoot = true;
    this.center = xCord;
	this.scores = scores;
    Entity.call(this, game, xCord, yCord);
}

FlyingRobot.prototype = new Entity();
FlyingRobot.prototype.constructor = FlyingRobot;

FlyingRobot.prototype.reset = function () {
	this.enemy = true;
    this.forward = true;
    this.heroInRange = false;
    this.enemyShoot = true;
}

FlyingRobot.prototype.update = function () {
    var enemyThat = this;
    if (this.health <= 0) {
        this.isDead = true;
    }
    if (this.isDead) {
		this.game.entities[2].scores += this.scores
		this.game.scores.innerHTML = "Scores: " + this.game.entities[2].scores;
        this.removeFromWorld = true;

        ///////////////////////////////////////////
        ///// Buff Drops everytime right now //////
        ///////////////////////////////////////////
        //Change the '* 1' inside the Math.random//
        /// to '* 10' to make it a 1/10th chance //
        ///////////////////////////////////////////
        var powerUpChance = Math.floor(Math.random() * 8) +1 ; //Generates a random number between 1-10
            if (powerUpChance === 1) {
                gameEngine.addPowerUp(new FirePowerUp(gameEngine,
                    AM.getAsset("./img/firepowerup.png"), this.x, this.y -15 ));
            } else if (powerUpChance === 2) {
                gameEngine.addPowerUp(new HeartPowerUp(gameEngine,
                    AM.getAsset("./img/heart.png"), this.x, this.y -15 ));
            } else if (powerUpChance === 3) {
                gameEngine.addPowerUp(new RapidFirePowerUp(gameEngine,
                    AM.getAsset("./img/gattling.png"), this.x, this.y -50));
            } else if (powerUpChance === 4) {
                gameEngine.addPowerUp(new lightningPowerUp(gameEngine,
                    AM.getAsset("./img/LightningOrbs.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 5) {
                gameEngine.addPowerUp(new DoubleDamagePowerUp(gameEngine,
                    AM.getAsset("./img/Chieftain_Pump_Shotgun_icon.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 6) {
                gameEngine.addPowerUp(new SpreadShotPowerUp(gameEngine,
                    AM.getAsset("./img/triple.png"), this.x, this.y -50));
            }
            else if (powerUpChance === 7) {
                gameEngine.addPowerUp(new GrenadePowerUp(gameEngine,
                    AM.getAsset("./img/grenade.png"), this.x, this.y -50));
            }
    }
    if ((Math.abs(this.game.entities[2].x - this.center) < 130)) this.heroInRange = true;
    else this.heroInRange = false;
    if ((Math.abs(this.x - this.game.entities[2].x) <= this.sight) && this.heroInRange) {
        if (Math.abs(this.x - (this.game.entities[2].x) - 15) < 5) {
            if (this.enemyShoot) {
                if (this.forward) {
                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 25, this.y + 44))
                    this.game.addEntity(new Bullet(this.game, this.x + 30, this.y + 70, this.forward
                        ,this.firingStance,true, false,this.unitType, 300, false));
                }
                else {
                    this.game.addEntity(new bulletFlash(this.game, AM.getAsset("./img/bulletFlash.png"),  this.x + 15, this.y + 44))
                    this.game.addEntity(new Bullet(this.game, this.x + 20, this.y + 70, this.forward
                        ,this.firingStance,true, false,this.unitType, 300, false, this.damage));
                }
                this.enemyShoot = false;
                setTimeout(function(){
                enemyThat.enemyShoot = true;
            }, 900);
            }
        }
        else if (this.x - this.game.entities[2].x > 10) {
            this.x -= this.game.clockTick * this.speed;
            this.forward = false;
        }
        else  {
            this.x += this.game.clockTick * this.speed;
            this.forward = true;
        }

    }
    else if (this.forward && (this.x - this.center < this.radius)) {
        this.x += this.game.clockTick * this.speed;
    }
    else if (((this.x - this.center) >= this.radius) && this.forward) {
        this.x -= this.game.clockTick * this.speed;
        this.forward = false;
    }
    else if (!this.forward && (this.x - this.center > -(this.radius))) {
        this.x -= this.game.clockTick * this.speed;
    }
    else if (((this.x - this.center) <= -(this.radius)) && !this.forward) {
        this.x += this.game.clockTick * this.speed;
        this.forward = true;
    }
    Entity.prototype.update.call(this);
}

FlyingRobot.prototype.draw = function () {
	if (!this.game.running) return;
    if (this.forward) this.flyingRobotFrontRun.drawFrame(this.game.clockTick, this.ctx
        , this.x - cameraX, this.y + cameraY);
    else if (!this.forward) this.flyingRobotBackRun.drawFrame(this.game.clockTick, this.ctx
        , this.x - cameraX, this.y + cameraY);
    Entity.prototype.draw.call(this);

}

function Bullet(game, startX, startY, direction, firingStance, standing, unitFlying, unitType, speed, heroShot, damage) {
    this.isBullet = true;
    this.speed = speed;
    this.ctx = game.ctx;
    this.firingStance = firingStance;
    this.width = 2;
    this.height = 2;
    this.damage = damage;
    this.unitType = unitType;
    this.isFlying = unitFlying;
    this.gameGround = 610;
    this.standing = standing;
    this.startX = startX;
    this.forward = direction;
    //if hero shot bullet, changes this next variable
    //to true, else is false
    this.heroShotIt = heroShot;
    Entity.call(this, game, startX, startY);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.reset = function () {
	//this.isBullet = true;
}


Bullet.prototype.update = function () {
    this.isCollide = false;
    this.collideForward = false


    var bulletGroundX = Math.round(this.x/25) + 1;
    var bulletGroundY = Math.floor((this.y )/25);
    if (this.y <= 70 || this.y >= 670) this.removeFromWorld = true;
   // if (this.x - cameraX > 750 ) this.removeFromWorld = true;
    if (map.layer[bulletGroundY - 1][bulletGroundX] == 'v'
                || map.layer[bulletGroundY ][bulletGroundX] == 'a'
                || map.layer[bulletGroundY ][bulletGroundX] == 'd'
                || map.layer[bulletGroundY ][bulletGroundX] == 'x') {
                    if (this.y > 560) {
                        if (this.y > 700) {

                            this.removeFromWorld = true;
                        }
                    }
                    else this.removeFromWorld = true;
                }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if ((ent.unitType !== "flash") && ent !== this && collide(this, ent)) {
            this.isCollide = true;
            if (this.x < ent.x) this.collideForward = true;
        }
    }
    if (this.isCollide) {
        this.isDead;
    }
    if (this.unitType === "flyingRobot") {
        this.y += this.game.clockTick * this.speed;
    }
    if (this.forward) {
        if (this.x >= this.startX + 500 ) {
            this.removeFromWorld = true;
        }
        else if (!this.standing) this.x += this.game.clockTick * this.speed;
        else if (this.firingStance === 4) this.y -= this.game.clockTick * this.speed;
        else if (this.firingStance === 2) this.x += this.game.clockTick * this.speed;
        else if (this.firingStance === 3) {
            this.x += this.game.clockTick * this.speed;
            this.y -= this.game.clockTick * this.speed;
        }
        else if (this.firingStance === 1) {
            this.x += this.game.clockTick * this.speed;
            this.y += this.game.clockTick * this.speed;
        }
    }
    else {
        if ((this.unitType === "giantRobot" || this.unitType === "finalBoss") && (map.layer[bulletGroundY][bulletGroundX] == 'v'
        || map.layer[bulletGroundY -2][bulletGroundX] == 'a'
        || map.layer[bulletGroundY -2][bulletGroundX] == 'd'
        || map.layer[bulletGroundY -2][bulletGroundX] == 'x') ) {
            this.firingStance = 2;
        }
        if (this.x <= this.startX - 1000 ) this.removeFromWorld = true
        else if (!this.standing) this.x -= this.game.clockTick * this.speed;
        else if (this.firingStance === 0) this.y += this.game.clockTick * this.speed;
        else if (this.firingStance === 4) this.y -= this.game.clockTick * this.speed;
        else if (this.firingStance === 2) this.x -= this.game.clockTick * this.speed;
        else if (this.firingStance === 3 && this.standing) {
            this.x -= this.game.clockTick * this.speed;
            this.y -= this.game.clockTick * this.speed;
        }
        else if (this.firingStance === 1 && this.standing) {
            this.x -= this.game.clockTick * this.speed;
            this.y += this.game.clockTick * this.speed;
        }
    }
    Entity.prototype.update.call(this);
}

Bullet.prototype.draw = function () {
    if (!this.game.running) return;
    if (this.unitType === "finalBoss") {
        this.ctx.fillStyle = "rgb(0,255,0)";
        this.ctx.beginPath();
        this.ctx.arc(this.x - cameraX,this.y + cameraY ,40,0,16*Math.PI); //this might be wrong
        this.ctx.closePath();
        this.ctx.fill();
    }
    if (this.unitType === "giantRobot") {
        this.ctx.fillStyle = "rgb(0,255,0)";
        this.ctx.beginPath();
        this.ctx.arc(this.x - cameraX,this.y + cameraY ,10,0,8*Math.PI); //this might be wrong
        this.ctx.closePath();
        this.ctx.fill();

    }
    else if (this.unitType === "hero" && hero.DoubleDamagePowerUp) {
        this.ctx.fillStyle = "rgb(0,255,0)";
        this.ctx.beginPath();
        this.ctx.arc(this.x - cameraX,this.y + cameraY ,6,0,8*Math.PI); //this might be wrong
        this.ctx.closePath();
        this.ctx.fill();
    }
    else {
        this.ctx.fillStyle = "rgb(0,255,0)";
        this.ctx.beginPath();
        this.ctx.arc(this.x - cameraX,this.y + cameraY ,4,0,2*Math.PI); //this might be wrong
        this.ctx.closePath();
        this.ctx.fill();
    }
    //Entity.prototype.draw.call(this);
}

function LevelPopUp(game, levelNumber) {
    this.myTime = gameEngine.timer.gameTime + 1;
    this.levelnum =  levelNumber;
    Entity.call(this, game, 0, 0);
}

LevelPopUp.prototype = new Entity();
LevelPopUp.prototype.constructor = Camera;

LevelPopUp.prototype.reset = function () {
}

var cameraX = 0;
var cameraY = 0;

LevelPopUp.prototype.update = function() {

  if (gameEngine.timer.gameTime > this.myTime) {
    gameEngine.removeEntity(this);
	gameEngine.gameState.innerHTML = "";
	if (gameEngine.running) {
		var temp = "Level " + this.levelnum;
		gameEngine.level_num.innerHTML = temp;
	}
  } else {
    gameEngine.gameState.innerHTML = "Well Done! Level Complete!"

  }


}

LevelPopUp.prototype.draw = function() {
  //this.game.drawImage(AM.getAsset("./img/nFloor.png"), 100, 100, sqFt, sqFt);
  //gameEngine.gameState.innerHTML = "Level Complete!"
  //gameEngine
  console.log("next level");
}



function NextLevel(game) {

  //*****************

  //Thu put that here

  //*****************


  if (map == map1) {
    //console.log("go to map 2");
    //this.game.running = false;
    game.entities[2].powerup = false;
    game.entities[2].x = 100;
    game.entities[2].y = 525;

    for (var i = 4; i < game.entities.length; i++) {
      game.entities[i].removeFromWorld = true;
    }
    map = map2;
    playaudio(gameEngine, "./music/Top5Songs.mp3")

    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 200, 125, 60, 2, 500, 100, 200));
    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 900, 125, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 1950, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 2960, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 6000, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 9860, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 9700, 150, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 9300, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 1350, 70, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 3350, 70, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 7234, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 8761, 150, 60, 2, 500, 100, 200));

    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),600,610, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1716,610, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3600,539, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3420,314, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),4110,660, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),6267,635, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),8400,388, 1, 400));

    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 3320, 575, 60, 1, "blueRobot",1000, 100, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/red_Robot.png"), AM.getAsset("./img/red_Robot.png"), 3608, 351 , 60, 1, "redRobot", 1000, 50, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 6030, 630, 60, 1, "blueRobot", 1000, 70, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 7680, 575, 60, 1, "blueRobot", 1000, 100, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 950, 476, 60, 1, "blueRobot", 1000, 100, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/red_Robot.png"), AM.getAsset("./img/red_Robot.png"), 6601, 551, 60, 1, "redRobot", 1000, 75, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/green_Robot.png"), AM.getAsset("./img/green_Robot.png"), 9100, 575, 60, 1, "greenRobot", 9000, 525, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 750, 524, 200, 3, 1000, 100, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 4000, 75, 200, 3, 1000, 100, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1125, 325, 200, 3, 2000, 100, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2330, 524, 200, 3, 3000, 100, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3500, 524, 200, 3, 400, 100, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3433, 380, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5785, 575, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 4310, 225, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3000, 524, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5187, 580, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 8757, 525, 200, 3, 400, 50, 400));


     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),2450,175, 8, 700, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),7300,400, 8, 700, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),10095,425, 8, 700, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),9650,425, 8, 700, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),1240, 565, 5, 800, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),1680, 366, 5, 900, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),2580, 565, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4680, 90, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4445, 615, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),5000, 615, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4141, 415, 5, 1000, 400));

     //*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&
     //Thu this is where you say something like "Level 2" or "Next Level"
     //*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&
     gameEngine.addEntity(new LevelPopUp(this.game, 2));


  } else if (map == map2) {
    //console.log("go to map 3");
    //this.game.running = false;
    game.entities[2].powerup = false;
    game.entities[2].x = 100;
    game.entities[2].y = 525;

    for (var i = 4; i < game.entities.length; i++) {
      game.entities[i].removeFromWorld = true;
    }
    playaudio(gameEngine, "./music/WhenTheBeatDrops.mp3")
    map = map3;

    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),350,585, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),425,560, 1, 400));
    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
    , AM.getAsset("./img/flyingRobot_Forward.png"), 400, 300, 60, 2, 500, 100, 200));
    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
    , AM.getAsset("./img/flyingRobot_Forward.png"), 700, 100, 60, 2, 500, 100, 200));
    gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
    , AM.getAsset("./img/idleGunTurrent.png"),1300, 340, 5, 1000, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/green_Robot.png"), AM.getAsset("./img/green_Robot.png"), 1100, 353, 60, 1, "greenRobot", 1500, 100, 300));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
    , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
    , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
    , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1550, 524, 200, 3, 1000, 0, 450));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
    , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
    , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
    , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1650, 300, 200, 3, 1000, 100, 300));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
    , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
    , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2100, 250, 200, 3, 1000, 100, 300));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2200, 250, 200, 3, 1000, 100, 300));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),2600, 340, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),3150, 240, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),3220, 565, 5, 1000, 400));
     gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 2000, 575, 30, 1, "blueRobot", 1200, 100, 300));
     gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 3050, 575, 30, 1, "blueRobot", 1200, 50, 300));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3400, 525, 200, 3, 2000, 100, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3700, 525, 200, 3, 2000, 300, 200));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3900, 525, 200, 3, 2000, 400, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),2000,150, 10, 2500, 350));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),4310,425, 10, 2500, 350));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4100, 440, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4100, 565, 5, 1000, 400));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 3800, 100, 60, 2, 600, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 4200, 200, 60, 2, 600, 100, 200));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1500,385, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1550,610, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),2100,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),2300,385, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3500,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3550,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3600,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),5300,610, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),5500,610, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),5700,610, 1, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5500, 525, 200, 3, 3000, 200, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5600, 525, 200, 3, 3000, 350, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5700, 525, 200, 3, 3000, 400, 400));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5350, 100, 60, 2, 700, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5500, 300, 60, 2, 700, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5700, 200, 60, 2, 700, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5900, 100, 60, 2, 700, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 6150, 200, 60, 2, 700, 100, 200));

     //*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&
     //Thu this is where you say something like "Level 3" or "Next Level"
     //*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&
     gameEngine.addEntity(new LevelPopUp(this.game, 3));

  } else if (map == map3) {
    //---------------
    // Level Complete
    //---------------
    //*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&
    //Thu this is where you show the Game complete screen :)
    //*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&
    gameEngine.running = false;
	//gameEngine.ctx.font = "24pt Impact";
    //gameEngine.ctx.fillStyle = "green";
	//gameEngine.ctx.fillText("Congratulation!", 370 , 180);
	gameEngine.gameState.innerHTML = "WOOHOO! ALL LEVELS COMPLETE!";
	

  }

}

//------- Music --------

function playaudio(obj,audiofile) {
  if (obj.mp3) {
      if(obj.mp3.paused) obj.mp3.play();
      else obj.mp3.pause();
  } else {
      obj.mp3 = new Audio(audiofile);
      obj.mp3.play();
  }
  obj.innerHTML = (obj.mp3.paused) ? "Play" : "Pause";
}

function playaudioFX(obj,audiofile) {
  if (obj.mp3) {
      if(obj.mp3.paused) obj.mp3.play();
      //else obj.mp3.pause();
  } else {
      obj.mp3 = new Audio(audiofile);
      obj.mp3.play();
  }
  obj.innerHTML = (obj.mp3.paused) ? "Play" : "Pause";
}

//----- End of Music ----



AM.queueDownload("./img/backDown45Hero.png");
AM.queueDownload("./img/backDown45RunHero.png");
AM.queueDownload("./img/backUp45Hero.png");
AM.queueDownload("./img/backUp45RunHero.png");
AM.queueDownload("./img/frontDown45Hero.png");
AM.queueDownload("./img/frontDown45RunHero.png");
AM.queueDownload("./img/frontUp45Hero.png");
AM.queueDownload("./img/frontUp45RunHero.png");
AM.queueDownload("./img/backgroundtrees.jpg");
AM.queueDownload("./img/backCrawl.png");
AM.queueDownload("./img/runningHero.png");
AM.queueDownload("./img/backwardHero.png");
AM.queueDownload("./img/backJump.png");
AM.queueDownload("./img/backwardStand.png");
AM.queueDownload("./img/frontJump.png");
AM.queueDownload("./img/frontStanding.png");
AM.queueDownload("./img/frontCrawl.png");
AM.queueDownload("./img/red_Robot.png");
AM.queueDownload("./img/blue_Robot.png");
AM.queueDownload("./img/orange_Robot.png");
AM.queueDownload("./img/green_Robot.png");
AM.queueDownload("./img/enemySoldier_Backward.png");
AM.queueDownload("./img/enemySoldier_Foward.png");
AM.queueDownload("./img/flyingRobot_Backward.png");
AM.queueDownload("./img/flyingRobot_Forward.png");
AM.queueDownload("./img/ForestTiles.png");
AM.queueDownload("./img/topGroundDark.png");
AM.queueDownload("./img/treeTrunk.png");
AM.queueDownload("./img/leaf1.png");
AM.queueDownload("./img/leaf2.png");
AM.queueDownload("./img/leaf3.png");
AM.queueDownload("./img/leaf4.png");
AM.queueDownload("./img/leaf5.png");
AM.queueDownload("./img/ground1.png");
AM.queueDownload("./img/ground2.png");
AM.queueDownload("./img/ground3.png");
AM.queueDownload("./img/ground4.png");
AM.queueDownload("./img/ground5.png");
AM.queueDownload("./img/nwGround.png");
AM.queueDownload("./img/neGround.png");
AM.queueDownload("./img/swGround.png");
AM.queueDownload("./img/seGround.png");
AM.queueDownload("./img/enemySoldier_StandingBackward.png");
AM.queueDownload("./img/enemySoldier_StandingFoward.png");
AM.queueDownload("./img/enemySoldier_CrouchBackward.png");
AM.queueDownload("./img/enemySoldier_CrouchFoward.png");
AM.queueDownload("./img/firepowerup.png");
AM.queueDownload("./img/idleGunTurrent.png");
AM.queueDownload("./img/firingGunTurrent.png");
AM.queueDownload("./img/giantRobotFoward.png");
AM.queueDownload("./img/giantRobotFiringFoward.png");
AM.queueDownload("./img/backCrouchHero.png");
AM.queueDownload("./img/backDamageHero.png");
AM.queueDownload("./img/backDown90Hero.png");
AM.queueDownload("./img/backUp90Hero.png");
AM.queueDownload("./img/fowardUp90Hero.png");
AM.queueDownload("./img/frontCrouchHero.png");
AM.queueDownload("./img/frontDamageHero.png");
AM.queueDownload("./img/frontDown90Hero.png");
AM.queueDownload("./img/landMines.png");
AM.queueDownload("./img/landMineFlash.png");
AM.queueDownload("./img/robotFlash.png");
AM.queueDownload("./img/bulletFlash.png");
AM.queueDownload("./img/frontDamageHero.png");
AM.queueDownload("./img/backDamageHero.png");
AM.queueDownload("./img/flameStandF.png");
AM.queueDownload("./img/flameStandB.png");
AM.queueDownload("./img/flameWalkForward.png");
AM.queueDownload("./img/flameWalkBackward.png");
AM.queueDownload("./img/FlameLDF.png");
AM.queueDownload("./img/FlameLDB.png");
AM.queueDownload("./img/flameJumpF.png");
AM.queueDownload("./img/flameJumpB.png");
AM.queueDownload("./img/FlameStandShootFU.png");
AM.queueDownload("./img/FlameStandShootBU.png");
AM.queueDownload("./img/FlameRunShootFU.png");
AM.queueDownload("./img/FlameRunShootBU.png");
AM.queueDownload("./img/FlameRunShootFD.png");
AM.queueDownload("./img/FlameRunShootBD.png");
AM.queueDownload("./img/FlameStandShootBD.png");
AM.queueDownload("./img/FlameStandShootFD.png");
AM.queueDownload("./img/flameCrouchF.png");
AM.queueDownload("./img/flameCrouchB.png");
AM.queueDownload("./img/flameStandShootUpF.png");
AM.queueDownload("./img/flameStandShootUpB.png");
AM.queueDownload("./img/flameStandShootDownF.png");
AM.queueDownload("./img/flameStandShootDownB.png");
AM.queueDownload("./img/heart.png");
AM.queueDownload("./img/gattling.png");
AM.queueDownload("./img/cover.png");
AM.queueDownload("./img/hero.png");
AM.queueDownload("./img/grenadeIcon.png");
AM.queueDownload("./img/grenade.png");
AM.queueDownload("./img/gernade.png");
AM.queueDownload("./img/bomb_sprite.png");
AM.queueDownload("./img/singleGernade.png");
AM.queueDownload("./img/LightningOrbs.png");
AM.queueDownload("./img/Chieftain_Pump_Shotgun_icon.png");
AM.queueDownload("./img/bananas.png");
AM.queueDownload("./img/triple.png");
AM.queueDownload("./img/finalBoss.png");
AM.queueDownload("./img/finalBossShooting.png");
//floor
AM.queueDownload("./img/eFloor.png");
AM.queueDownload("./img/midFloor.png");
AM.queueDownload("./img/neFloor.png");
AM.queueDownload("./img/nFloor.png");
AM.queueDownload("./img/nwFloor.png");
AM.queueDownload("./img/seFloor.png");
AM.queueDownload("./img/sFloor.png");
AM.queueDownload("./img/swFloor.png");
AM.queueDownload("./img/wFloor.png");
//-----
//green back
AM.queueDownload("./img/bigGreenLights.png");
AM.queueDownload("./img/bigRedLights.png");
AM.queueDownload("./img/green.png");
AM.queueDownload("./img/panel.png");
AM.queueDownload("./img/smallGreenLights.png");
AM.queueDownload("./img/smallRedLights.png");
AM.queueDownload("./img/vent.png");
//----
AM.queueDownload("./img/lava.png");


AM.downloadAll(function () {
	
    var canvas = document.getElementById("gameWorld");
	var name = document.getElementById('name');
	var lives = document.getElementById('lives');  // THU add
	var times = document.getElementById('times');
	var scores = document.getElementById('scores');
	var level_num = document.getElementById('level_num');
	var total_scores = document.getElementById('total_scores');
	var grenades = document.getElementById('grenades');
	var gameState = document.getElementById('gameState');

    var ctx = canvas.getContext("2d");

	gameEngine.name = name;
	gameEngine.lives = lives;			// Thu add
	gameEngine.times = times;
	gameEngine.scores = scores;
	gameEngine.level_num = level_num;
	gameEngine.total_scores = total_scores;
	gameEngine.grenades = grenades;
	gameEngine.gameState = gameState;
	gameEngine.running = false;			// THU add

    gameEngine.init(ctx);
    gameEngine.start();

    var heroSprite = [AM.getAsset("./img/runningHero.png"), AM.getAsset("./img/backwardHero.png")
    , AM.getAsset("./img/frontStanding.png"), AM.getAsset("./img/backwardStand.png"), AM.getAsset("./img/frontJump.png")
    , AM.getAsset("./img/backJump.png"), AM.getAsset("./img/backCrawl.png"), AM.getAsset("./img/frontCrawl.png")
    , AM.getAsset("./img/frontUp45Hero.png"), AM.getAsset("./img/frontUp45RunHero.png"), AM.getAsset("./img/frontDown45Hero.png")
    , AM.getAsset("./img/frontDown45RunHero.png"), AM.getAsset("./img/backUp45Hero.png"), AM.getAsset("./img/backUp45RunHero.png")
    , AM.getAsset("./img/backDown45Hero.png"), AM.getAsset("./img/backDown45RunHero.png"), AM.getAsset("./img/frontDown90Hero.png")
    , AM.getAsset("./img/frontDamageHero.png"), AM.getAsset("./img/frontCrouchHero.png"), AM.getAsset("./img/fowardUp90Hero.png")
    , AM.getAsset("./img/backUp90Hero.png"), AM.getAsset("./img/backDown90Hero.png"), AM.getAsset("./img/backDamageHero.png")
    , AM.getAsset("./img/backCrouchHero.png"), AM.getAsset("./img/frontDamageHero.png"), AM.getAsset("./img/backDamageHero.png")
    , AM.getAsset("./img/flameStandF.png"), AM.getAsset("./img/flameStandB.png"), AM.getAsset("./img/flameWalkForward.png")
    , AM.getAsset("./img/flameWalkBackward.png"), AM.getAsset("./img/FlameLDF.png"), AM.getAsset("./img/FlameLDB.png")
    , AM.getAsset("./img/flameJumpF.png"), AM.getAsset("./img/flameJumpB.png"), AM.getAsset("./img/FlameStandShootFU.png")
    , AM.getAsset("./img/FlameStandShootBU.png"), AM.getAsset("./img/FlameRunShootFU.png"), AM.getAsset("./img/FlameRunShootBU.png")
    , AM.getAsset("./img/FlameRunShootFD.png"), AM.getAsset("./img/FlameRunShootBD.png"), AM.getAsset("./img/FlameStandShootBD.png")
    , AM.getAsset("./img/FlameStandShootFD.png"), AM.getAsset("./img/flameCrouchF.png"), AM.getAsset("./img/flameCrouchB.png")
    , AM.getAsset("./img/flameStandShootUpF.png"), AM.getAsset("./img/flameStandShootUpB.png"), AM.getAsset("./img/flameStandShootDownF.png")
    , AM.getAsset("./img/flameStandShootDownB.png"), AM.getAsset("./img/LightningOrbs.png")];


    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/backgroundtrees.jpg")));

    gameEngine.addEntity(new Platform(gameEngine));

    hero = new Hero(gameEngine, heroSprite, 200, 525, 10, 3);
    gameEngine.addEntity(hero);
	gameEngine.Hero = hero;

    gameEngine.addEntity(new Camera(gameEngine));


    //----------------
    if (map == map1) {
        playaudio(gameEngine, "./music/Wave.mp3")
        gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/green_Robot.png"), AM.getAsset("./img/green_Robot.png"), 850, 575, 60, 1, "greenRobot", 5000, 100, 300));
        
        gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 900, 575, 30, 1, "blueRobot", 1200, 100, 300));
        
        gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/red_Robot.png"), AM.getAsset("./img/red_Robot.png"), 1800, 575, 60, 1, "redRobot", 1500, 100, 300));
        
        gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 2300, 575, 30, 1, "blueRobot", 2000, 100, 300));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 700, 524, 200, 3, 1000, 100, 400));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1450, 330, 200, 3, 2000, 100, 400));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1750, 330, 200, 3, 3000, 100, 400));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1300, 525, 200, 3, 2000, 100, 400));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1000, 525, 200, 3, 500, 100, 400));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2100, 525, 200, 3, 1500, 100, 400));
        
        gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
        , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
        , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
        , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2500, 525, 200, 3, 500, 100, 400));
        
        gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
        , AM.getAsset("./img/flyingRobot_Forward.png"), 400, 100, 60, 2, 500, 100, 200));
        
        gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
        , AM.getAsset("./img/flyingRobot_Forward.png"), 1000, 300, 60, 2, 600, 100, 200));
        
        gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
        , AM.getAsset("./img/flyingRobot_Forward.png"), 1700, 100, 60, 2, 700, 100, 200));
        
        gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
        , AM.getAsset("./img/flyingRobot_Forward.png"), 2900, 100, 60, 2, 800, 100, 200));
        
        gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
        , AM.getAsset("./img/flyingRobot_Forward.png"), 1300, 100, 60, 2, 900, 100, 200));
        
        gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
        , AM.getAsset("./img/idleGunTurrent.png"),1600, 465, 5, 1000, 400));
        
        gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
        , AM.getAsset("./img/idleGunTurrent.png"),1220, 565, 5, 2000, 400));
        
         gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
         , AM.getAsset("./img/idleGunTurrent.png"),2260, 315, 5, 3000, 400));
        
        gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
        , AM.getAsset("./img/giantRobotFoward.png"),2850,427, 10, 2500, 400));
        
        gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),400,610, 1, 400));
        gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1260,510, 1, 500));
        gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1620,410, 1, 600));
        gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),2081,610, 1, 700));

    } else if (map == map2) {
      playaudio(gameEngine, "./music/Top5Songs.mp3")
    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 200, 125, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 900, 125, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 1950, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 2960, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 6000, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 9860, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 9700, 150, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 9300, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 1350, 70, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 3350, 70, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 7234, 100, 60, 2, 500, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 8761, 150, 60, 2, 500, 100, 200));

    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),600,610, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1716,610, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3600,539, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3420,314, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),4110,660, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),6267,635, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),8400,388, 1, 400));

    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 3320, 575, 60, 1, "blueRobot",1000, 100, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/red_Robot.png"), AM.getAsset("./img/red_Robot.png"), 3608, 351 , 60, 1, "redRobot", 1000, 50, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 6030, 630, 60, 1, "blueRobot", 1000, 70, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 7680, 575, 60, 1, "blueRobot", 1000, 100, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 950, 476, 60, 1, "blueRobot", 1000, 100, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/red_Robot.png"), AM.getAsset("./img/red_Robot.png"), 6601, 551, 60, 1, "redRobot", 1000, 75, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/green_Robot.png"), AM.getAsset("./img/green_Robot.png"), 9100, 575, 60, 1, "greenRobot", 9000, 525, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 750, 524, 200, 3, 1000, 100, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 4000, 75, 200, 3, 1000, 100, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1125, 325, 200, 3, 2000, 100, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2330, 524, 200, 3, 3000, 100, 400));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3500, 524, 200, 3, 400, 100, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3433, 380, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5785, 575, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 4310, 225, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3000, 524, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5187, 580, 200, 3, 400, 50, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 8757, 525, 200, 3, 400, 50, 400));


     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),2450,175, 8, 700, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),7300,400, 8, 700, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),10095,425, 8, 700, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),9650,425, 8, 700, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),1240, 565, 5, 800, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),1680, 366, 5, 900, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),2580, 565, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4680, 90, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4445, 615, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),5000, 615, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4141, 415, 5, 1000, 400));
  } else if (map == map3) {

    playaudio(gameEngine, "./music/WhenTheBeatDrops.mp3")
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),350,585, 1, 400));
    gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),425,560, 1, 400));
    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
    , AM.getAsset("./img/flyingRobot_Forward.png"), 400, 300, 60, 2, 500, 100, 200));
    gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
    , AM.getAsset("./img/flyingRobot_Forward.png"), 700, 100, 60, 2, 500, 100, 200));
    gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
    , AM.getAsset("./img/idleGunTurrent.png"),1300, 340, 5, 1000, 400));
    gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/green_Robot.png"), AM.getAsset("./img/green_Robot.png"), 1100, 353, 60, 1, "greenRobot", 1500, 100, 300));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
    , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
    , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
    , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1550, 524, 200, 3, 1000, 0, 450));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
    , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
    , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
    , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 1650, 300, 200, 3, 1000, 100, 300));
    gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
    , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
    , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2100, 250, 200, 3, 1000, 100, 300));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 2200, 250, 200, 3, 1000, 100, 300));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),2600, 340, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),3150, 240, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),3220, 565, 5, 1000, 400));
     gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 2000, 575, 30, 1, "blueRobot", 1200, 100, 300));
     gameEngine.addEntity(new Robot(gameEngine, AM.getAsset("./img/blue_Robot.png"), AM.getAsset("./img/blue_Robot.png"), 3050, 575, 30, 1, "blueRobot", 1200, 50, 300));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3400, 525, 200, 3, 2000, 100, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3700, 525, 200, 3, 2000, 300, 200));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 3900, 525, 200, 3, 2000, 400, 400));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),2000,150, 10, 2500, 350));
     gameEngine.addEntity(new GiantRobot(gameEngine, AM.getAsset("./img/giantRobotFiringFoward.png")
     , AM.getAsset("./img/giantRobotFoward.png"),4310,425, 10, 2500, 350));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4100, 440, 5, 1000, 400));
     gameEngine.addEntity(new GunTurrent(gameEngine, AM.getAsset("./img/firingGunTurrent.png")
     , AM.getAsset("./img/idleGunTurrent.png"),4100, 565, 5, 1000, 400));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 3800, 100, 60, 2, 600, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 4200, 200, 60, 2, 600, 100, 200));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1500,385, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),1550,610, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),2100,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),2300,385, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3500,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3550,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),3600,335, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),5300,610, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),5500,610, 1, 400));
     gameEngine.addEntity(new landMine(gameEngine, AM.getAsset("./img/landMines.png"),5700,610, 1, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5500, 525, 200, 3, 3000, 200, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5600, 525, 200, 3, 3000, 350, 400));
     gameEngine.addEntity(new EnemySoldier(gameEngine, AM.getAsset("./img/enemySoldier_Backward.png")
     , AM.getAsset("./img/enemySoldier_Foward.png"), AM.getAsset("./img/enemySoldier_StandingBackward.png")
     , AM.getAsset("./img/enemySoldier_StandingFoward.png"),AM.getAsset("./img/enemySoldier_CrouchFoward.png")
     , AM.getAsset("./img/enemySoldier_CrouchBackward.png"), 5700, 525, 200, 3, 3000, 400, 400));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5350, 100, 60, 2, 700, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5500, 300, 60, 2, 700, 100, 200));
     gameEngine.addEntity(new FlyingRobot(gameEngine, AM.getAsset("./img/flyingRobot_Backward.png")
     , AM.getAsset("./img/flyingRobot_Forward.png"), 5700, 200, 60, 2, 700, 100, 200));

     gameEngine.addEntity(new FinalBoss(gameEngine, AM.getAsset("./img/finalBossShooting.png")
     , AM.getAsset("./img/finalBoss.png"),5600,230, 10, 2500, 350));

  } else if (map == map4) {

  }
    gameEngine.addEntity(new Cover(gameEngine, AM.getAsset("./img/cover.png")));
    gameEngine.addEntity(new HeroIcon(gameEngine, AM.getAsset("./img/hero.png")));
	gameEngine.addEntity(new GrenadeIcon(gameEngine, AM.getAsset("./img/grenadeIcon.png")));
    var pg = new PlayGame(gameEngine, 370, 180);
    gameEngine.addEntity(pg);



        console.log("All Done!");
});
