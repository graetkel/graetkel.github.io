var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
  this.animation = new Animation(spritesheet,0,0, 499, 374, 0.09, 16, true, false);
  this.speed = 100;
  this.ctx = game.ctx;
  Entity.call(this, game, 0, 0);
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

Background.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.9);
    Entity.prototype.draw.call(this);
}

// inheritance Bull
function Bull(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 194, 219, 0.15, 6, true, false);
    this.speed = 150;
    this.ctx = game.ctx;
    Entity.call(this, game, 300, 338);
}

Bull.prototype = new Entity();
Bull.prototype.constructor = Bull;

Bull.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Bull.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.75);
    Entity.prototype.draw.call(this);
}

//--------------------------

//--------------- Man Spear

// inheritance
function ManSpear(game, spritesheetF, spritesheetB, spritesheetL, spritesheetR) {
    this.animationF = new Animation(spritesheetF, 0, 0, 136, 141, 0.15, 6, true, false);
    this.animationB = new Animation(spritesheetB, 0, 0, 136, 141, 0.15, 6, true, true);
    this.animationL = new Animation(spritesheetL, 0, 0, 136, 141, 0.15, 1, true, false);
    this.animationR = new Animation(spritesheetR, 0, 0, 136, 141, 0.15, 1, true, false);
    this.speed = 150;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 255);
}

ManSpear.prototype = new Entity();
ManSpear.prototype.constructor = ManSpear;

var manPosition = 0;

document.onkeydown = KeyCheckDown;
function KeyCheckDown() {
    var KeyID = event.keyCode;
    switch(KeyID) {
        case 37:// Draw the animation walk left
            manPosition = 3;
            console.log("left");
            break;
        case 39:// Draw the animation walk right
            manPosition = 4;
            console.log("right");
            break;
    }
}

document.onkeyup = KeyCheckUp;
function KeyCheckUp() {
    var KeyID = event.keyCode;
    switch(KeyID) {
        case 37:// Draw the animation walk left
            manPosition = 1;
            console.log("left");
            break;
        case 39:// Draw the animation walk right
            manPosition = 2;
            console.log("right");
            //that.context.
            break;
    }
}


ManSpear.prototype.update = function () {
    switch (manPosition) {
      case 3:
      this.x += this.game.clockTick * -this.speed;
      if (this.x > 800) this.x = -230;
      Entity.prototype.update.call(this);
      break;
      case 4:
      this.x += this.game.clockTick * this.speed;
      if (this.x > 800) this.x = -230;
      Entity.prototype.update.call(this);
      break;
      default:

    }
}


ManSpear.prototype.draw = function () {
  switch (manPosition) {
    case 0: //init
    this.animationR.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    break;
    case 1: //Stand left
    this.animationL.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    break;
    case 2: //Stand right
    this.animationR.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    break;
    case 3: //Walk left
    this.animationB.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    break;
    case 4: //Walk right
    this.animationF.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    break;
    //default:
  }
  Entity.prototype.draw.call(this);
}


//--------------------------

//--------------- Zombie

// inheritance
function Zombie(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 94, 151, 0.15, 6, true, false);
    this.speed = 75;
    this.ctx = game.ctx;
    Entity.call(this, game, 500, 410);

}

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;


Zombie.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.6);
    Entity.prototype.draw.call(this);
}

//--------------------------

//--------------- Wizard

// inheritance
function Wizard(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 119, 155, 0.15, 6, true, false);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 381);
}

Wizard.prototype = new Entity();
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Wizard.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.8);
    Entity.prototype.draw.call(this);
}

//--------------------------

//--------------- Specter

// inheritance
function Specter(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 164, 171, 0.15, 4, true, false);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 100);
}

Specter.prototype = new Entity();
Specter.prototype.constructor = Specter;

Specter.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Specter.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.7);
    Entity.prototype.draw.call(this);
}

//--------------------------

//// inheritance
//function Guy(game, spritesheet) {
//    this.animation = new Animation(spritesheet, 154, 215, 4, 0.15, 8, true, 0.5);
//    this.speed = 100;
//    this.ctx = game.ctx;
//    Entity.call(this, game, 0, 450);
//}
//
//Guy.prototype = new Entity();
//Guy.prototype.constructor = Guy;
//
//Guy.prototype.update = function () {
//    this.x += this.game.clockTick * this.speed;
//    if (this.x > 800) this.x = -230;
//    Entity.prototype.update.call(this);
//}
//
//Guy.prototype.draw = function () {
//    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//    Entity.prototype.draw.call(this);
//}


//AM.queueDownload("./img/RobotUnicorn.png");
//AM.queueDownload("./img/guy.jpg");
//AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/bullSprite.png");
AM.queueDownload("./img/ManSpearSprite.png");
AM.queueDownload("./img/ManSpearBSprite.png");
AM.queueDownload("./img/ManLeft.png");
AM.queueDownload("./img/ManRight.png");
AM.queueDownload("./img/ZombieSprite.png");
AM.queueDownload("./img/WizardSprite.png");
AM.queueDownload("./img/SpecterSprite.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/CityPark.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/CityPark.png")));
//    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    gameEngine.addEntity(new Bull(gameEngine, AM.getAsset("./img/bullSprite.png")));
    gameEngine.addEntity(new ManSpear(gameEngine, AM.getAsset("./img/ManSpearSprite.png"),
          AM.getAsset("./img/ManSpearBSprite.png"), AM.getAsset("./img/ManLeft.png"),
          AM.getAsset("./img/ManRight.png")));
    //gameEngine.addEntity(new ManSpearB(gameEngine, AM.getAsset("./img/ManSpearBSprite.png")));
    gameEngine.addEntity(new Zombie(gameEngine, AM.getAsset("./img/ZombieSprite.png")));
    gameEngine.addEntity(new Wizard(gameEngine, AM.getAsset("./img/WizardSprite.png")));
    gameEngine.addEntity(new Specter(gameEngine, AM.getAsset("./img/SpecterSprite.png")));
//    gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));

    //gameEngine.addEventListener("load", gameLoop);
    //this.ctx.canvas.addEventListener("keydown", function(e));


    console.log("All Done!");
});
