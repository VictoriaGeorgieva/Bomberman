/**
 * Created by Victoria on 1/31/2016.
 */
Game = function(type)
{
    this.type = type;
    this.player = new Player('first');
    this.second_player = new Player('second');
    this.paused = false;
    this.images = {};
    this.InGameMenu = null;
    this.fieldElementsPeriphery = fillArrayOfObjectsPeriphery();
    this.fieldElementsInside = fillArrayOfObjectsInside();
    this.enemies = fillArrayOfEnemies();
    this.bonusTypes = ['fire', 'bomb', 'time', 'enemy_freeze'];
    this.bonus = '';
    this.playBackground = true;
    timer();
}

Game.prototype.Logic = function(elapsed)
{
    if(this.playBackground){
        AudioManager.play("game_theme");
        this.playBackground = false
    }

    InputManager.padUpdate();

    if (InputManager.padPressed & InputManager.PAD.CANCEL) {
        this.paused = true;
        this.StartInGameMenu();
    }

    this.player.updatePosition();

    if(this.type == 'multiplayer'){
        this.second_player.updatePosition();
    }
}

Game.prototype.Render = function(elapsed)
{
    var self = this;
    self.player.bombImage = self.images['bomb'];
    self.player.fireImage = self.images['fireball'];

    if(self.type == 'multiplayer'){
        self.second_player.bombImage = self.images['bomb'];
        self.second_player.fireImage = self.images['fireball'];
    }

    ctx.drawImage(self.images['background'], 0, 0, canvas.width, canvas.height);

    var checkIfUserIsBlocked = false;
    var checkIfSecondPlayerIsBlocked = false;

    $.each(self.fieldElementsPeriphery, function(){
        var field = this;
        var imageToDraw = self.images['rock'];
        ctx.drawImage(imageToDraw, field.x, field.y);

        $.each(self.enemies, function(){
            if(checkForCollision(this, field)){
                //call enemy method to use last coordinates
                this.UseLastCoordinates();
            }
        });
    });

    $.each(self.fieldElementsInside, function(){
        var imageToDraw = self.images['rock'];
        var field = this;

        var checkIfToShow = true;

        if(field.canBeDestroyed){
            imageToDraw = self.images['brick'];
        }

        $.each(self.player.fire, function(){
            if(checkForCollision(field, this)){

                this.RemoveBlockedFire(self.player.fire, this, field, field.canBeDestroyed);

                if(field.canBeDestroyed) {
                    checkIfToShow = false;
                    return;
                }
            }
        });

        if(self.type == 'multiplayer'){
            $.each(self.second_player.fire, function(){
                if(checkForCollision(field, this)){

                    this.RemoveBlockedFire(self.second_player.fire, this, field, field.canBeDestroyed);

                    if(field.canBeDestroyed) {
                        checkIfToShow = false;
                        return;
                    }
                }
            });
        }

        if(checkForCollision(self.player, field)){
            checkIfUserIsBlocked = true;
        }

        if(self.type == 'multiplayer') {
            if (checkForCollision(self.second_player, field)) {
                checkIfSecondPlayerIsBlocked = true;
            }
        }

        if(checkIfToShow) {
            ctx.drawImage(imageToDraw, field.x, field.y);
        }else{

            if(self.bonus == ''){

                var randomNumber = Math.floor(Math.random() * 6) + 1;

                if(randomNumber == 3){
                    if(self.type == 'multiplayer') {
                        var index = self.bonusTypes.indexOf('enemy_slowdown');

                        if (index == -1) {
                            self.bonusTypes.push('enemy_slowdown');
                        }
                    }
                    var type = self.bonusTypes.randomElement();
                    self.bonus = new Bonus(38, 38, self.images['bonus_' + type], field.x, field.y, type);

                    setTimeout(function () {
                        self.bonus = '';
                    }, 6000);
                }
            }

            var index = self.fieldElementsInside.indexOf(field);

            if (index > -1) {
                self.fieldElementsInside.splice(index, 1);
            }
        }

        $.each(self.enemies, function(){
            if(checkForCollision(this, field)){
                //call enemy method to use last coordinates
                this.UseLastCoordinates();
            }
        });
    });

    if(self.bonus != '') {
        var showBonus = true;

        if(checkForCollision(self.player, self.bonus)){
            var result = self.bonus.playerGetBonus(self.player, self.second_player, self.enemies);

            if(result == 'enemy_freezed'){
                setTimeout(function () {
                    $.each(self.enemies, function(){
                        this.freeze = false;
                    });
                 }, 5000);

            }else if(result == 'enemy_slow'){
                setTimeout(function () {
                    self.second_player.speed = 200;
                }, 5000);
            }else if(result !== ''){
                time = result;
            }
            self.bonus = '';

            showBonus = false;
        }

        if(self.type == 'multiplayer') {
            if(checkForCollision(self.second_player, self.bonus)){
                var result = self.bonus.playerGetBonus(self.second_player, self.player, self.enemies);

                if(result == 'enemy_freezed'){
                    setTimeout(function () {
                        $.each(self.enemies, function(){
                            this.freeze = false;
                        });
                    }, 5000);

                }else if(result == 'enemy_slow'){
                    setTimeout(function () {
                        self.player.speed = 200;
                    }, 5000);
                }else if(result !== ''){
                    time = result;
                }
                self.bonus = '';

                showBonus = false;
            }
        }

        if(showBonus){
            ctx.drawImage(self.bonus.image, self.bonus.x, self.bonus.y);
        }
    }

    if (checkIfUserIsBlocked) {
        self.player.x = self.player.lastX;
        self.player.y = self.player.lastY;
    } else {
        self.player.lastX = self.player.x;
        self.player.lastY = self.player.y;
    }

    if(self.type == 'multiplayer') {
        if (checkIfSecondPlayerIsBlocked) {
            self.second_player.x = self.second_player.lastX;
            self.second_player.y = self.second_player.lastY;
        } else {
            self.second_player.lastX = self.second_player.x;
            self.second_player.lastY = self.second_player.y;
        }
    }

    ctx.drawImage(self.images[self.player.currentImage], self.player.x, self.player.y);

    if(self.type == 'multiplayer') {
        ctx.drawImage(self.images[self.second_player.currentImage], self.second_player.x, self.second_player.y);
    }

    $.each(self.player.bombs, function(){
        if(this.x != 0 || this.y != 0){
            this.Update();
            this.Render();
        }
    });

    if(self.type == 'multiplayer') {
        $.each(self.second_player.bombs, function(){
            if(this.x != 0 || this.y != 0){
                this.Update();
                this.Render();
            }
        });
    }

    $.each(self.player.fire, function(){
        var fire = this;
        ctx.drawImage(self.player.fireImage, fire.x, fire.y);

        if(checkForCollision(self.player, fire)){
            GameLoopManager.stop();

            //alert("GAME OVER");
            //call method to save game result
            AudioManager.stop("game_theme");
            AudioManager.play("game_over");
            saveGameResult(false, time);
        }

        if(checkForCollision(self.second_player, fire)){
            GameLoopManager.stop();

            AudioManager.stop("game_theme");
            AudioManager.play("game_win");

            //alert("WIN");
            //call method to save game result
            saveGameResult(true, time);
        }

        $.each(self.enemies, function(){
            if(checkForCollisionFieldFire(this, fire)){
                self.enemies.splice(self.enemies.indexOf(this), 1);
            }
        });

        var index = self.player.fire.indexOf(fire);

        if (index > -1) {
            setTimeout(function () {
                self.player.fire.splice(index, 1);
            }, 200);
        }
    });

    if(self.type == 'multiplayer') {
        $.each(self.second_player.fire, function(){
            var fire = this;
            ctx.drawImage(self.second_player.fireImage, fire.x, fire.y);

            if(checkForCollision(self.second_player, fire)){
                GameLoopManager.stop();

                AudioManager.stop("game_theme");
                AudioManager.play("game_win");

                //alert("WIN");
                //call method to save game result
                saveGameResult(true, time);
            }

            if(checkForCollision(self.player, fire)){
                GameLoopManager.stop();

                //alert("GAME OVER");

                AudioManager.stop("game_theme");
                AudioManager.play("game_over");

                //call method to save game result
                saveGameResult(false, time);
            }

            $.each(self.enemies, function(){
                if(checkForCollisionFieldFire(this, fire)){
                    self.enemies.splice(self.enemies.indexOf(this), 1);
                }
            });

            var index = self.second_player.fire.indexOf(fire);

            if (index > -1) {
                setTimeout(function () {
                    self.second_player.fire.splice(index, 1);
                }, 200);
            }
        });
    }

    $.each(self.enemies, function(){
        var enemy = this;

        if(checkForCollision(self.player, enemy)){
            GameLoopManager.stop();

            AudioManager.stop("game_theme");
            AudioManager.play("game_over");

            //call method to save game result
            //alert("GAME OVER");
            saveGameResult(false, time);
        }

        $.each(self.player.bombs, function(){
            if(checkForCollisionFieldFire(enemy, this)){
                //call enemy method to use last coordinates
                enemy.UseLastCoordinates();
                return;
            }
        });

        if(self.type == 'multiplayer') {
            if(checkForCollision(self.second_player, enemy)){
                GameLoopManager.stop();

                AudioManager.stop("game_theme");
                AudioManager.play("game_win");

                //alert("WIN");
                //call method to save game result
                saveGameResult(true, time);
            }

            $.each(self.second_player.bombs, function(){
                if(checkForCollisionFieldFire(enemy, this)){
                    //call enemy method to use last coordinates
                    enemy.UseLastCoordinates();
                    return;
                }
            });
        }

        ctx.drawImage(self.images['enemy_1'], enemy.x, enemy.y);

        enemy.lastX = enemy.x;
        enemy.lastY = enemy.y;

        enemy.Move();
    });

    if(self.type == 'singleplayer') {
        if (self.enemies.length == 0) {
            GameLoopManager.stop();

            AudioManager.stop("game_theme");
            AudioManager.play("game_win");

            //alert("single player....WIN");
            //call method to save game result
            saveGameResult(true, time);
        }
    }
}

Game.prototype.StartInGameMenu = function()
{
    InputManager.reset();
    var bindThis = this;
    this.InGameMenu = new Menu("In-game Menu",
        [ "Continue", "Quit" ],
        "",
        70, 50, 400,
        function(numItem) {
            if (numItem == 0) { GameLoopManager.run(function(elapsed) { bindThis.Tick(elapsed); }); bindThis.paused = false; bindThis.InGameMenu = null;  }
            else if (numItem == 1) {
                AudioManager.stop("game_theme");
                StartMainMenu();
            }
        },
        function(elapsed) { bindThis.Render(elapsed); });
    GameLoopManager.run(function(elapsed) { bindThis.InGameMenu.Tick(elapsed); });
}

Game.prototype.Tick = function(elapsed)
{
    this.Logic(elapsed);
    this.Render(elapsed);
}

var time = 0;
function timer(){
    $('#timer').css('display','inline-block');
    $('#titleTimer').css('display', 'inline-block');

    setTimeout(function(){
        var timeDiv = document.getElementById("timer");
        time++;
        timeDiv.innerHTML = time;
        timer();
    }, 1000);
}

function saveGameResult(winOrNot, timeFinished) {
    var currentHour = new Date().getHours();

    var timezone = '0-4';

    if(currentHour >= 16 && currentHour < 24){
        timezone = '16-24';
    }else if(currentHour >= 8 && currentHour < 16){
        timezone = '8-16';
    }else if(currentHour >= 4 && currentHour < 8){
        timezone = '4-8';
    }

    var gameInfo = {
        'userId': LoggedUser.id,
        'userName': LoggedUser.username,
        'game_date': Date(),
        'win': winOrNot,
        'time': timeFinished,
        'timezone': timezone
    };

    $.ajax({
        type: 'POST',
        url: '/game/addGame/',
        data: gameInfo,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            if(winOrNot == true){
                alert("Congratulations, you win!");
            }else{
                alert("Game Over");
            }
            //alert('Congratulations! You win... ');
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

var fillArrayOfObjectsPeriphery = function(){

    var arrOfElements = [];

    var currentX = (canvas.width - 42);
    var currentY = 0;

    while(currentY < (canvas.height - 42)){
        var element = new FieldElement(42, 42, 0, currentY, false);
        arrOfElements.push(element);

        var element = new FieldElement(42, 42, currentX, currentY, false);
        arrOfElements.push(element);

        currentY += element.height;
    }

    var currentX = 0;
    var currentY = (canvas.height - 42);

    while(currentX < (canvas.width - 42)){
        var element = new FieldElement(42, 42, currentX, 0, false);
        arrOfElements.push(element);

        var element = new FieldElement(42, 42, currentX, currentY, false);
        arrOfElements.push(element);

        currentX += element.width;
    }

    return arrOfElements;
}

var fillArrayOfObjectsInside = function(){

    var arrOfElements = [];

    var currentY = 0;
    var counter = 1;

    while(currentY < (canvas.height - 84)) {
        if (counter != 1 && (counter % 2 == true)) {
            var xToAdd = 84;

            if (currentY > 128) {
                var element = new FieldElement(42, 42, (xToAdd - 42), currentY, true);
                arrOfElements.push(element);
            }

            while (xToAdd < (canvas.width - 126)) {

                var element = new FieldElement(42, 42, xToAdd, currentY, false);
                arrOfElements.push(element);

                if((xToAdd + 42) != 714 || currentY != 84) {
                    var element = new FieldElement(42, 42, (xToAdd + 42), currentY, true);
                    arrOfElements.push(element);
                }

                xToAdd += element.height * 2;
            }
        }else if(counter != 1 && (counter % 2 == false)){
            var xToAdd = 84;
            while (xToAdd < (canvas.width - 126)) {

                if((currentY != 42 || xToAdd != 84) &&( currentY != 42 || xToAdd != 672)) {
                    var element = new FieldElement(42, 42, xToAdd, currentY, true);
                    arrOfElements.push(element);
                }

                xToAdd += 84;
            }
        }

        currentY += 42;
        counter++;
    }

    return arrOfElements;
}

var fillArrayOfEnemies = function(){
    var arrOfEnemies = [];

    var element = new Enemy(39, 40, 42, (canvas.height - 84));
    arrOfEnemies.push(element);

    var element = new Enemy(39, 40, (7*42), (canvas.height - 84));
    arrOfEnemies.push(element);

    var element = new Enemy(39, 40, (canvas.width - (8*42)), (canvas.height - 84));
    arrOfEnemies.push(element);

    var element = new Enemy(39, 40, (canvas.width - 84), (canvas.height - 84));
    arrOfEnemies.push(element);

    return arrOfEnemies;
}
