/**
 * Created by Victoria on 2/8/2016.
 */
Bomb = function(width, height, image, numberOfFrames, ticksPerFrame, destinationX, destinationY, rangePower){
    this.width = width;
    this.height = height;
    this.image = image;
    this.numberOfFrames = numberOfFrames;
    this.ticksPerFrame = ticksPerFrame;
    this.x = destinationX;
    this.y = destinationY;
    this.rangePower = rangePower;

    this.sprite = sprite({
        context: ctx,
        width: (this.width * this.numberOfFrames),
        height: this.height,
        image: this.image,
        numberOfFrames: this.numberOfFrames,
        ticksPerFrame: this.ticksPerFrame,
        destinationX: this.x,
        destinationY: this.y
    });
}

Bomb.prototype.constructor = Bomb;

Bomb.prototype.Update = function(){
    this.sprite.update();
}
Bomb.prototype.Render = function() {
    this.sprite.render();
}

Bomb.prototype.Explode = function(){
    AudioManager.play("bomb_exploding");
}