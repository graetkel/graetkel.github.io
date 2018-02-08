var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
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
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

//CHANGED: drawFrameB is a new method the draws backwards
//TODO: Make it so it draws backwards
Animation.prototype.drawFrameB = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
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
                 this.frameWidth * this.scale,
                 (this.frameHeight * this.scale));


}


Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
  this.animation = new Animation(spritesheet, 499, 374, 4, 0.15, 16, true, 1.9);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


//---------------

// inheritance Bull
function Bull(game, spritesheet) {
    this.animation = new Animation(spritesheet, 194, 219, 6, 0.15, 6, true, 0.75);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//--------------------------

//--------------- Man Spear

// inheritance
function ManSpear(game, spritesheetF, spritesheetB, spritesheetL, spritesheetR) {
    this.animationF = new Animation(spritesheetF, 136, 141, 6, 0.15, 6, true, 1);
    this.animationB = new Animation(spritesheetB, 136, 141, 6, 0.15, 6, true, 1);
    this.animationL = new Animation(spritesheetL, 136, 141, 1, 0.15, 1, true, 1);
    this.animationR = new Animation(spritesheetR, 136, 141, 1, 0.15, 1, true, 1);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 000);
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
            //that.context.
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
    this.animationR.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    break;
    case 1: //Stand left
    this.animationL.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    break;
    case 2: //Stand right
    this.animationR.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    break;
    case 3: //Walk left
    this.animationB.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    break;
    case 4: //Walk right
    this.animationF.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    break;
    default:

  }
  Entity.prototype.draw.call(this);
}


//--------------------------

//--------------- Zombie

// inheritance
function Zombie(game, spritesheet) {
    this.animation = new Animation(spritesheet, 94, 151, 6, 0.15, 6, true, 0.6);
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

    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//--------------------------

//--------------- Wizard

// inheritance
function Wizard(game, spritesheet) {
    this.animation = new Animation(spritesheet, 119, 155, 6, 0.15, 6, true, .8
    );
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 381);
}

Wizard.prototype = new Entity();
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function () {
    //    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
    //        this.x += this.game.clockTick * this.speed;
    //    if (this.x > 800) this.x = -230;


    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Wizard.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//--------------------------

//--------------- Specter

// inheritance
function Specter(game, spritesheet) {
    this.animation = new Animation(spritesheet, 164, 171, 4, 0.15, 4, true, 0.7);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 100);
}

Specter.prototype = new Entity();
Specter.prototype.constructor = Specter;

Specter.prototype.update = function () {
    //    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
    //        this.x += this.game.clockTick * this.speed;
    //    if (this.x > 800) this.x = -230;


    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Specter.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
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
