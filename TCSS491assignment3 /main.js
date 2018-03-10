var gameEngine = new GameEngine();
var saveFile;
var socket = io.connect("http://24.16.255.56:8888");

var gamu;

socket.on("connect", function () {
    console.log("Socket connected.")
});


function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}


function Circle(game) {
    this.player = 1;
    this.radius = 10;
    this.visualRadius = 500;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.attacker = false;
    this.color = 0;
    this.visualRadius = 400;
    this.xt = [this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x, this.x];
    this.yt = [this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y, this.y];
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.attacker = false;
    this.color = 3;
    this.visualRadius = 300;
};

Circle.prototype.hunter = function () {
    this.it = false;
    this.attacker = true;
    this.color = 2;
    this.visualRadius = 400;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

// function simpleStringify (object){
//     var simpleObject = {};
//     for (var prop in object ){
//         if (!object.hasOwnProperty(prop)){
//             continue;
//         }
//         if (typeof(object[prop]) == 'object'){
//             continue;
//         }
//         if (typeof(object[prop]) == 'function'){
//             continue;
//         }
//         simpleObject[prop] = object[prop];
//     }
//     return JSON.stringify(simpleObject); // returns cleaned up JSON
// };

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
    gamu =  this.game;


    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    //If Ball collides into left or right walls
    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = this.velocity.x * friction; //CHANGED (-this.velocity to this.velocity)
        if (this.collideLeft()) this.x = 800 - this.radius; //CHANGED
        if (this.collideRight()) this.x = this.radius; //CHANGED
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    //If ball collides into top or bottom walls
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = this.velocity.y * friction; //CHANGED (-this.velocity to this.velocity)
        if (this.collideTop()) this.y = 800 - this.radius; //CHANGED
        if (this.collideBottom()) this.y = this.radius; //CHANGED
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    //If this ball and every other ball
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];



        //Everything that has to do with collition
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;

            var zombieKillDraw = Math.floor((Math.random() * 25) + 1);
            //if Red collide into any color
            if (this.it && (!ent.attacker && !ent.it)) {
                if (zombieKillDraw != 1) {
                ent.setIt();
              } else {
                ent.removeFromWorld = true;
              }
            }


            var luckyHeroDraw = Math.floor((Math.random() * 1000) + 1);
            if (this.attacker && !ent.it && luckyHeroDraw == 1) {
              ent.hunter();
            }

            var plagueDraw = Math.floor((Math.random() * 500) + 1);
            if (!this.it && plagueDraw == 1) {
              this.setIt()
            }

            if (this.it) {
            }
            var babyDraw = Math.floor((Math.random() * 10) + 1);
            if (!this.it && !ent.it && babyDraw == 1) {
              this.game.entities.push(new Circle(this.game));
            }



            var fiftyfiftyDraw = Math.floor((Math.random() * 10) + 1);

            if ((this.attacker && ent.it)) {
              if (fiftyfiftyDraw = 1) {
                ent.removeFromWorld = true;
              } else {
                ent.setNotIt()
              }
            }

            if (!this.attacker && ent.it) {
              this.setIt();
            }

            if (this.attacker && ent.it) {
              ent.setNotIt();
            }
            if (this.it && ent.attacker) {
              this.setNotIt();
            }

        } // End of collition

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);

            //If zombie
            if (this.it && dist > this.radius + ent.radius + 10 && !ent.attacker && !ent.it) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }


            //If human
            if (ent.it && dist + 250 > this.radius + ent.radius) {
                maxSpeed = 350;
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio * 3.5;
                    this.velocity.y *= ratio * 3.5;
                }
                maxSpeed = 200
            }

            if (ent.it && dist > this.radius + ent.radius && !ent.attacker) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }

            //This is for hunter
            if ((this.attacker && dist > this.radius + ent.radius + 10) && ent.it) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x += difX * acceleration / (dist * dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio * 2;
                    this.velocity.y *= ratio * 2;
                }
            }
            //End of hunter
        }
      }// I dont know where this one goes
};

Circle.prototype.draw = function (ctx) {
    if (this.it) {
      for (var i = 0; i < this.xt.length - 1; i++) {
        this.xt[i] = this.xt[i+1];
        this.yt[i] = this.yt[i+1];
      }
      this.xt[this.xt.length] = this.x;
      this.yt[this.yt.length] = this.y;

      for (var i = this.xt.length; i > this.xt.length - 40; i= i - 1) {
        var opp = this.xt.length + (i * -1);
        var tempRad = this.radius - ((opp*2)/10);
        ctx.beginPath();
        ctx.fillStyle = this.colors[0];
        ctx.arc(this.xt[i], this.yt[i], tempRad, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }
    }

    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};



function saveSim() {

var tempVel = [];
var tempX = [];
var tempY = [];
var tempXt = [];
var tempYt = [];
var tempIt = [];
var tempAtt = [];
var tempVis = [];
var tempCol = [];
var tempAll = []


for (var i = 0; i < gamu.entities.length; i++) {
  tempVel.push(gamu.entities[i].velocity);
  tempX.push(gamu.entities[i].x);
  tempY.push(gamu.entities[i].y);
  tempXt.push(gamu.entities[i].xt);
  tempYt.push(gamu.entities[i].yt);
  tempIt.push(gamu.entities[i].it);
  tempAtt.push(gamu.entities[i].attacker);
  tempVis.push(gamu.entities[i].visualRadius);
  tempCol.push(gamu.entities[i].color);
}
var myLen = gamu.entities.length;
saveFile = {vel: tempVel, x: tempX, y: tempY, xt: tempXt, yt: tempYt, it: tempIt, att: tempAtt, vis: tempVis, col: tempCol, len: myLen};


socket.emit("save", { studentname: "Keldon Fischer", statename: "Save", data: saveFile });

}

function loadSim() {

          socket.emit("load", { studentname: "Keldon Fischer", statename: "Save" });

          socket.on("load", function (data) {

              var loadData = data.data;

              var tempVel = loadData.vel;
              var tempX = loadData.x;
              var tempY = loadData.y;
              var tempXt = loadData.xt;
              var tempYt = loadData.yt;
              var tempIt = loadData.it;
              var tempAtt = loadData.att;
              var tempVis = loadData.vis;
              var tempCol = loadData.col;

              for (var i = 0; i < gamu.entities.length; i++) {
                gameEngine.entities[i].removeFromWorld = true;
              }

              for (var i = 0; i < loadData.len; i++) {
                var myCircle = new Circle(gameEngine);
                myCircle.velocity = tempVel[i];
                myCircle.x = tempX[i];
                myCircle.y = tempY[i];
                myCircle.xt = tempXt[i];
                myCircle.yt = tempYt[i];
                myCircle.it = tempIt[i];
                myCircle.attacker = tempAtt[i];
                myCircle.visualRadius = tempVis[i];
                myCircle.color = tempCol[i];

                gameEngine.addEntity(myCircle);

              }
          });


}



// the "main" code begins here
var friction = 1;
var acceleration = 10000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");
// var gameEngine = new GameEngine();
ASSET_MANAGER.downloadAll(function () {

    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var circle = new Circle(gameEngine);
    circle.setIt();
    gameEngine.addEntity(circle);
    for (var i = 0; i < 10; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }
    circle.hunter();
    gameEngine.init(ctx);

    gameEngine.start();

});
