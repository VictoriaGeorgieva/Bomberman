/**
 * Created by Victoria on 2/16/2016.
 */
Bonus = function(width, height, image, destinationX, destinationY, type){
    this.width = width;
    this.height = height;
    this.image = image;
    this.x = destinationX;
    this.y = destinationY;
    this.type = type;
}

Bonus.prototype.constructor = Bonus;

Bonus.prototype.playerGetBonus = function(player, second_player, enemies){
    AudioManager.play("bonus_get");

    var resultToReturn = '';

    switch (this.type){
        case 'fire':
            console.log('player get more fire');
            player.userBombPower++;

            resultToReturn = '';
            break;
        case 'bomb':
            console.log('player get more bombs');
            player.numberOfBombsAllowed++;

            resultToReturn = '';
            break;
        case 'time':
            console.log('player get more time');

            var timeDiv = document.getElementById("timer");
            var time = document.getElementById("timer").innerText;
            time -= 20;

            if(time < 0){
                time = 0;
            }

            timeDiv.innerHTML = time;
            resultToReturn = time;

            break;
        case 'enemy_freeze':
            $.each(enemies, function(){
                this.freeze = true;
            });
            resultToReturn = 'enemy_freezed';
            break;
        case 'enemy_slowdown':
            second_player.speed = 50;
            resultToReturn = 'enemy_slow';
            break;
    }

    return resultToReturn;
}