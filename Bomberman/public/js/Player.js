Player = function(type)
{
    this.x = 42;
    this.y = 42;
    this.lastX = 42;
    this.lastY = 42;

    if(type == 'second'){
        this.x = canvas.width - 84;
        this.lastX = canvas.width - 84;
    }

    this.width = 35;
    this.height = 57
    this.speed = 200;
    this.currentNumberOfBombs = 0;
    this.numberOfBombsAllowed = 1;
    this.currentImage = 'player_front';
    this.userBombPower = 1;
    this.bombs = [];
    this.bombImage;
    this.fire = [];
    this.fireImage;
    this.player_type = type;
}

Player.prototype.constructor = Player;

Player.prototype.updatePosition = function(){

    var self = this;

    var movement = self.speed * 0.013;
    InputManager.padUpdate();

    var down = InputManager.KEY.ARROW_DOWN;
    var up = InputManager.KEY.ARROW_UP;
    var left = InputManager.KEY.ARROW_LEFT;
    var right = InputManager.KEY.ARROW_RIGHT;
    var bomb = InputManager.KEY.ENTER;

    if(self.player_type == 'second'){
        down = InputManager.KEY.S;
        up = InputManager.KEY.W;
        left = InputManager.KEY.A;
        right = InputManager.KEY.D;
        bomb = InputManager.KEY.SPACEBAR;
    }

    //move down
    if(down in InputManager.currentlyPressedKeys && InputManager.currentlyPressedKeys[down] == true){
        if((self.y + movement) > (canvas.height - 83) ){
            self.y = canvas.height - 83;
        }else{
            self.y += movement;
        }

        this.currentImage = "player_front";
    }

    //move up
    if (up in InputManager.currentlyPressedKeys && InputManager.currentlyPressedKeys[up] == true){
        if((self.y - movement) < 42 ){
            self.y = 42;
        }else{
            self.y -= movement;
        }

        self.currentImage = "player_back";
    }

    //move left
    if (left in InputManager.currentlyPressedKeys && InputManager.currentlyPressedKeys[left] == true){
        if((self.x - movement) < 42 ){
            self.x = 42;
        }else{
            self.x -= movement;
        }

        self.currentImage = "player_left";
    }

    //move right
    if (right in InputManager.currentlyPressedKeys && InputManager.currentlyPressedKeys[right] == true){
        if((self.x + movement) > (canvas.width - 72) ){
            self.x = canvas.width - 72;
        }else{
            self.x += movement;
        }

        self.currentImage = "player_right";
    }

    if(bomb in InputManager.currentlyPressedKeys && InputManager.currentlyPressedKeys[bomb]){
        if(self.currentNumberOfBombs < self.numberOfBombsAllowed){

            var bomb = new Bomb(36, 36, self.bombImage, 5, 2, self.x, self.y, self.userBombPower);
            self.bombs.push(bomb);

            self.currentNumberOfBombs = self.bombs.length;

            //console.log(self.currentNumberOfBombs);
            setTimeout(function () {

                bomb.Explode();

                var fireCoordinates = [];

                var initial = {
                    'x': bomb.x,
                    'y': bomb.y
                };

                fireCoordinates.push(initial);

                var count = 1;
                while(count <= bomb.rangePower){

                    var tempX = bomb.x - (count * 38);

                    if(tempX > 42) {
                        var tempPush = {
                            'x': tempX,
                            'y': bomb.y
                        };

                        fireCoordinates.push(tempPush);
                    }

                    var tempX = bomb.x + (count * 38);

                    if(tempX < (canvas.width - 72)) {
                        var tempPush = {
                            'x': tempX,
                            'y': bomb.y
                        };

                        fireCoordinates.push(tempPush);
                    }

                    var tempY = bomb.y - (count * 38);

                    if(tempY >= 42) {
                        var tempPush = {
                            'x': bomb.x,
                            'y': tempY
                        };

                        fireCoordinates.push(tempPush);
                    }

                    var tempY = bomb.y + (count * 38);

                    if(tempY < (canvas.height - 83)) {
                        var tempPush = {
                            'x': bomb.x,
                            'y': tempY
                        };

                        fireCoordinates.push(tempPush);
                    }

                    count++;
                }

                $.each(fireCoordinates, function(){
                    var fire = new Fire(38, 38, self.fireImage, this.x, this.y);
                    self.fire.push(fire);
                });

                self.bombs.splice(0, 1);
                self.currentNumberOfBombs--;

            }, 2000);
            return;
        }
    }
}