/**
 * Created by Victoria on 1/31/2016.
 */
// Global vars
canvas = null;
ctx = null;

var MainGame = null;
var MainMenu = null;
var LoggedUser = null;
var UserTimeline = null;
var UserStatistics = null;

var menuOptionsClicked = function(numItem){
    switch(numItem){
        case 0:
            StartGame('singleplayer');
            break;
        case 1:
            StartGame('multiplayer');
            break;
        case 2:
            ClearCanvas();
            StartTimeline();
            break;
        case 3:
            ClearCanvas();

            GameLoopManager.stop();
            MainMenu = null;

            GameLoopManager.run(function(elapsed) { LoggedUser.Tick(elapsed); });
            break;
        case 4:
            ClearCanvas();
            StartStatistics();
            break;
        case 5:
            console.log("Logout");
            location.reload();
            break;
    }
};

function StartGame(type)
{
    GameLoopManager.stop();
    MainMenu = null;
    MainGame = new Game(type);
    // Async load audio and images, start gameplay when loaded
    MultiStepLoader( [
        [ "audio", function(cb, i) {
            AudioManager.load({
                'bomb_timer'       : 'audio/bomb_timing_cutted',
                'bomb_exploding'   : 'audio/explosion',
                'bonus_get'        : 'audio/bonus',
                'monster_killed'   : 'audio/explosion',
                'player_killed'    : 'audio/explosion',
                'game_theme'       : 'audio/game_theme',
                'game_over'        : 'audio/game_over',
                'game_win'         : 'audio/game_win'
            }, function() {
                cb(i); } ) } ],
        [ "images", function(cb, i) {
            LoadImages(MainGame.images, {
                background           : "images/background.png",
                rock                 : "images/rock.png",
                brick                : "images/brick.png",
                brick_faded          : "images/brick_faded.png",
                player_right         : "images/player_right.png",
                player_front         : "images/player_front.png",
                player_left          : "images/player_left.png",
                player_back          : "images/player_back.png",
                enemy_1              : "images/enemy_1.png",
                bomb                 : "images/bomb_bigger.png",
                fireball             : "images/fireball.png",
                bonus_fire           : "images/bonus_fire.png",
                bonus_bomb           : "images/bonus_bomb.png",
                bonus_time           : "images/bonus_time.png",
                bonus_enemy_freeze   : "images/bonus_enemy_freeze.png",
                bonus_enemy_slowdown : "images/bonus_enemy_slowdown.png"
            }, function() {
                cb(i); } ) } ],
    ], function() {
        // All done, go!
        InputManager.reset();
        GameLoopManager.run(function(elapsed) { MainGame.Tick(elapsed); });
    } );
}

function StartTimeline(){
    GameLoopManager.stop();
    MainMenu = null;
    UserTimeline = new Timeline();

    GameLoopManager.run(function(elapsed) { UserTimeline.Tick(elapsed); });
}

function StartStatistics(){
    GameLoopManager.stop();
    MainMenu = null;
    UserStatistics = new Statistics("normal");

    GameLoopManager.run(function(elapsed) { UserStatistics.Tick(elapsed); });
}

function StartMainMenu()
{
    $('#timer').css('display','none');
    GameLoopManager.stop();
    MainGame = null;
    // Async load audio and start menu when loaded
    MultiStepLoader( [
        [ "audio", function(cb, i) {
            AudioManager.load({
                'blip'   : 'audio/blip',
                'select' : 'audio/select'
            }, function() {
                cb(i); } ) } ],
    ], function() {
        // All done, go!
        InputManager.reset();
        MainMenu = new Menu("Bomberman",
            [ "New Game", "Multiplayer", "Timeline", "Profile", "Statistics", "Logout" ],
            LoggedUser.username,
            70, 50, 400,
            menuOptionsClicked,
            null);
        GameLoopManager.run(function(elapsed) { MainMenu.Tick(elapsed); });
    } );
}

function ClearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0,0,canvas.width, canvas.height);
}

function LoadLoginForm(){
    ctx.fillStyle = "White";
    ctx.font = 30 + "px Times New Roman";
    ctx.fillText("Login Form", (canvas.width/2 - 60), 70);

    var yValue = 190;

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Username:", 180, yValue);
    var userNameField = new CanvasText( canvas, {
        x: 300,
        y: (yValue - 10),
        fontSize: 16,
        width: 300,
        height: 35
    });

    yValue += 45;

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Password:", 185, yValue);
    var userPassField = new CanvasPassword( canvas, {
        x: 300,
        y: (yValue - 10),
        fontSize: 16,
        width: 300,
        height: 35
    } );

    yValue += 45;

    var loginButton = new CanvasSubmit( canvas, {
        x: 300,
        y: 305,
        fontSize: 16,
        width: 300,
        height: 35,
        placeholder: 'Login',
        onSubmit: ( function() {
            if(userNameField.value == "" || userPassField.value == ""){
                ctx.fillStyle = "Red";
                ctx.font = 20 + "px Times New Roman";
                ctx.fillText("*Username and Password are required", 300, 275);
            }else{
                //request to database to login
                var loginUser = {
                    'username': userNameField.value,
                    'password': userPassField.value
                }

                $.ajax({
                    type: 'POST',
                    data: loginUser,
                    url: '/user/login',
                    dataType: 'JSON'
                }).done(function( response ) {

                    // Check for successful (blank) response
                    if (response.msg === '') {
                        if(response.user == ''){
                            ctx.fillStyle = "Red";
                            ctx.font = 20 + "px Times New Roman";
                            ctx.fillText("*Invalid username or password", 300, 275);
                        }else{
                            ClearCanvas();

                            userNameField.destroy();
                            userPassField.destroy();
                            registerButton.destroy();
                            loginButton.destroy();

                            var friendsList = [];
                            var invitesList = [];

                            var numberOfFriends = 0;

                            if(typeof response.user.list_of_friends != 'undefined'){
                                friendsList = response.user.list_of_friends;
                                numberOfFriends = response.user.list_of_friends.length;
                            }

                            if(typeof response.user.invites != 'undefined'){
                                invitesList = response.user.invites;
                            }

                            LoggedUser = new User(response.user._id, response.user.username, response.user.email, new Date(response.user.registration_date).toLocaleString(), 0, numberOfFriends, friendsList, invitesList);

                            InputManager.connect(document, canvas);
                            StartMainMenu();
                        }
                    }
                    else {

                        // If something goes wrong, alert the error message that our service returned
                        alert('Error: ' + response.msg);

                    }
                });
            }
        })
    });

    var registerButton = new CanvasSubmit( canvas, {
        x: 300,
        y: 350,
        fontSize: 16,
        width: 300,
        height: 35,
        placeholder: 'Register',
        onSubmit: ( function() {
            ClearCanvas();
            userNameField.destroy();
            userPassField.destroy();
            loginButton.destroy();

            //load registration form
            LoadRegisterForm();

            //LoadForm("register", "Register Form");
        })
    });
}

function LoadRegisterForm(){
    ctx.fillStyle = "White";
    ctx.font = 30 + "px Times New Roman";
    ctx.fillText("Register Form", (canvas.width/2 - 60), 70);

    var yValue = 150;

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Email:", 220, yValue);
    var emailField = new CanvasText( canvas, {
        x: 300,
        y: (yValue - 10),
        fontSize: 16,
        width: 300,
        height: 35
    });

    yValue += 45;

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Username:", 180, yValue);
    var userNameField = new CanvasText( canvas, {
        x: 300,
        y: (yValue - 10),
        fontSize: 16,
        width: 300,
        height: 35
    });

    yValue += 45;

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Password:", 185, yValue);
    var userPassField = new CanvasPassword( canvas, {
        x: 300,
        y: (yValue - 10),
        fontSize: 16,
        width: 300,
        height: 35
    } );

    yValue += 45;

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Confirm Password:", 100, yValue);
    var confirmPassField = new CanvasPassword( canvas, {
        x: 300,
        y: (yValue - 10),
        fontSize: 16,
        width: 300,
        height: 35
    });

    yValue += 50;

    var registerButton = new CanvasSubmit( canvas, {
        x: 300,
        y: 350,
        fontSize: 16,
        width: 300,
        height: 35,
        placeholder: 'Register',
        onSubmit: ( function() {
            if(userNameField.value == "" || emailField.value == "" || userPassField.value == "" ||  confirmPassField.value == ""){
                ctx.fillStyle = "Red";
                ctx.font = 20 + "px Times New Roman";
                ctx.fillText("*All fields are required", 300, 320);
            }else{
                var newUser = {
                    'username': userNameField.value,
                    'email': emailField.value,
                    'password': userPassField.value,
                    'registration_date': Date()
                }

                //console.log(newUser);

                $.ajax({
                    type: 'POST',
                    data: newUser,
                    url: '/user/adduser',
                    dataType: 'JSON'
                }).done(function( response ) {

                    // Check for successful (blank) response
                    if (response.msg === '') {

                        //return alert( 'Register clicked ');
                        ClearCanvas();

                        emailField.destroy();
                        userNameField.destroy();
                        userPassField.destroy();
                        confirmPassField.destroy();
                        registerButton.destroy();

                        LoadLoginForm();
                        //LoadForm("login", "Login Form");
                    }
                    else {

                        // If something goes wrong, alert the error message that our service returned
                        alert('Error: ' + response.msg);

                    }
                });
            }
        })
    });
}

$(document).ready(function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
    /*InputManager.connect(document, canvas);*/

    var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    LoadLoginForm();
});