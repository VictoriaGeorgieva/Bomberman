/**
 * Created by Victoria on 2/12/2016.
 */
Enemy = function(width, height, destinationX, destinationY){
    this.width = width;
    this.height = height;
    this.x = destinationX;
    this.y = destinationY;
    this.lastX = destinationX;
    this.lastY = destinationY;
    this.targetX = null;
    this.targetY = null;
    this.speed = 200;
    this.directions = ["left", "right", 'up', 'down'];
    this.direction = 'up';
    this.freeze = false;
}

Enemy.prototype.constructor = Enemy;

Enemy.prototype.UseLastCoordinates = function() {
    this.x = this.lastX;
    this.y = this.lastY;

    var directions = ["left", "right", 'up', 'down'];
    directions.splice(directions.indexOf(this.direction),1);
    this.direction = directions.randomElement();
}

Enemy.prototype.Move = function(){
    if(!this.freeze) {
        var movement = this.speed * 0.01;

        switch (this.direction) {
            case "up":
                if ((this.y - movement) < 0) {
                    this.y = 42;
                } else {
                    this.y -= movement;
                }
                break;
            case "down":
                if ((this.y + movement) > (canvas.height)) {
                    this.y = canvas.height;
                } else {
                    this.y += movement;
                }
                break;
            case "left":
                if ((this.x - movement) < 0) {
                    this.x = 0;
                } else {
                    this.x -= movement;
                }
                break;
            case "right":
                if ((this.x + movement) > (canvas.width)) {
                    this.x = canvas.width;
                } else {
                    this.x += movement;
                }
                break;
            default:
                if ((this.y - movement) < 42) {
                    this.y = 42;
                } else {
                    this.y -= movement;
                }
                break;
        }
    }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}