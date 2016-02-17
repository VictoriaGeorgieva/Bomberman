/**
 * Created by Victoria on 2/13/2016.
 */
Statistics = function(type){
    this.type = type;
}

Statistics.prototype.RenderCanvas = function() {

    var lingrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    new CanvasSubmit(canvas, {
        x: 715,
        y: 20,
        fontSize: 16,
        width: 65,
        height: 35,
        placeholder: '',
        onSubmit: ( function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
            lingrad.addColorStop(0, '#000');
            lingrad.addColorStop(1, '#023');
            ctx.fillStyle = lingrad;
            ctx.fillRect(0,0,canvas.width, canvas.height);

            $('#userList').hide();

            StartMainMenu();
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 20 + "px Times New Roman";
    ctx.fillText("Menu", 770, 25);

    GameLoopManager.stop();
}

Statistics.prototype.LoadStatistics = function() {

    if(this.type == 'normal'){
        ctx.fillStyle = "White";
        ctx.font = 30 + "px Times New Roman";
        ctx.fillText("Statistics", canvas.width/2 + 50, 70);

        ctx.fillStyle = "Orange";
        ctx.font = 26 + "px Times New Roman";
        ctx.fillText("TOP 3 /WON GAMES/", 310, 160);

        ctx.moveTo(312,153);
        ctx.lineTo(360,153);
        ctx.lineTo(360,310);
        ctx.lineTo(10,310);
        ctx.lineTo(10,153);
        ctx.lineTo(60,153);
        ctx.strokeStyle="#fff";
        ctx.stroke();

        loadTopThreeNumberOfGames();

        ctx.fillStyle = "Orange";
        ctx.font = 26 + "px Times New Roman";
        ctx.fillText("TOP 3 /FASTEST GAMES/", 760, 160);

        ctx.moveTo(762,153);
        ctx.lineTo(790,153);
        ctx.lineTo(790,310);
        ctx.lineTo(430,310);
        ctx.lineTo(430,153);
        ctx.lineTo(460,153);
        ctx.strokeStyle="#fff";
        ctx.stroke();

        loadTopThreeFastestGames();

        new CanvasSubmit( canvas, {
            x: 200,
            y: (canvas.height - 80),
            width: 400,
            height: 35,
            fontSize: 18,
            placeholder: "Show Statistics By Timezone",
            typeToCalculateSpace: 'MessageBox',
            onSubmit: ( function() {

                GameLoopManager.stop();
                MainMenu = null;
                UserStatistics = new Statistics("timezone");

                GameLoopManager.run(function(elapsed) { UserStatistics.Tick(elapsed); });
            })
        });
    }else{

        ctx.fillStyle = "White";
        ctx.font = 30 + "px Times New Roman";
        ctx.fillText("Statistics By Timezone", canvas.width/2 + 150, 70);

        new CanvasSubmit(canvas, {
            x: 15,
            y: 20,
            fontSize: 16,
            width: 65,
            height: 35,
            placeholder: '',
            onSubmit: ( function () {
                GameLoopManager.stop();
                MainMenu = null;
                UserStatistics = new Statistics("normal");

                GameLoopManager.run(function(elapsed) { UserStatistics.Tick(elapsed); });
            })
        });

        ctx.fillStyle = "White";
        ctx.font = 20 + "px Times New Roman";
        ctx.fillText("Back", 70, 25);

        new CanvasSubmit(canvas, {
            x: 350,
            y: 20,
            fontSize: 16,
            width: 85,
            height: 35,
            placeholder: '',
            onSubmit: ( function () {
                var user = {
                    'username': LoggedUser.username
                };

                if(typeof LoggedUser.list_of_friends != 'undefined'){
                    $.each(LoggedUser.list_of_friends, function(){
                        user[this.username] = this.username;
                    });
                }

                $.ajax({
                    type: 'POST',
                    url: '/statistics/getTimezoneStatistics/',
                    data: user,
                }).done(function( response ) {
                    // Check for a successful (blank) response
                    if (response.msg === '') {
                        console.log(response.result);

                        var tableContent = '';
                        $.each(response.result, function(){
                            var user = this;

                            tableContent += '<tr>';
                            tableContent += '<td>' + user._id + '</a></td>';
                            tableContent += '</tr>';

                            $.each(user.games, function() {
                                tableContent += '<tr>';
                                tableContent += '<td>' + '' + '</a></td>';
                                tableContent += '<td>' + this.timezone + '</a></td>';
                                tableContent += '<td>' + '' + '</a></td>';
                                tableContent += '<td>' + this.percentCalculated.toFixed(2) + ' %' + '</a></td>';
                                tableContent += '</tr>';
                            });
                        });

                        $('#userList table tbody').html(tableContent);
                        $('#userList').css('display','inline-block');
                    }
                    else {
                        alert('Error: ' + response.msg);
                    }
                });
                /*var tableContent = '';

                $.each(self.list_of_friends, function(){
                    tableContent += '<tr>';
                    tableContent += '<td>' + this.username + '</a></td>';
                    tableContent += '</tr>';
                });

                // Inject the whole content string into our existing HTML table
                $('#userList table tbody').html(tableContent);
                $('#userList').css('display','inline-block');*/
                //ctx.clearRect(0, 0, canvas.width, canvas.height);
            })
        });

        ctx.fillStyle = "White";
        ctx.font = 20 + "px Times New Roman";
        ctx.fillText("Show All", 430, 25);

        loadTimezoneStatistics();
    }
}

var loadTopThreeNumberOfGames = function(){

    var user = {
        'username': LoggedUser.username
    };

    if(typeof LoggedUser.list_of_friends != 'undefined'){
        $.each(LoggedUser.list_of_friends, function(){
            user[this.username] = this.username;
        });
    }

    $.ajax({
        type: 'POST',
        url: '/statistics/getTopThreeDependingOnNumberOfWonGames/',
        data: user,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            var xValue = 30;
            var yValue = 200;

            var count = 1;
            $.each(response.result, function(){
                ctx.fillStyle = "White";
                ctx.font = 25 + "px Times New Roman";
                ctx.fillText(count + ". " + this._id + " -", (xValue + ctx.measureText(count + ". " + this._id + " -").width), yValue);

                ctx.fillText(this.totalGamesPlayed + " Victories", (xValue + ctx.measureText(count + ". " + this._id + " -").width + ctx.measureText(this.totalGamesPlayed + " Victories").width + 10), yValue);

                yValue += 40;

                count++;
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

var loadTopThreeFastestGames = function(){

    var user = {
        'username': LoggedUser.username
    };

    if(typeof LoggedUser.list_of_friends != 'undefined'){
        $.each(LoggedUser.list_of_friends, function(){
            user[this.username] = this.username;
        });
    }

    $.ajax({
        type: 'POST',
        url: '/statistics/getTopThreeFastestGames/',
        data: user,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {

            var xValue = 450;
            var yValue = 200;

            var count = 1;
            $.each(response.result, function(){
                ctx.fillStyle = "White";
                ctx.font = 25 + "px Times New Roman";
                ctx.fillText(count + ". " + this.userName + " -", (xValue + ctx.measureText(count + ". " + this.userName + " -").width), yValue);

                if(this.time < 60){
                    ctx.fillText("00:" + this.time + " sec", (xValue + ctx.measureText(count + ". " + this.userName + " -").width + ctx.measureText("00: " + this.time + " sec").width + 10), yValue);
                }else{
                    var minutes = Math.floor(this.time / 60);
                    var seconds = this.time - (minutes * 60);

                    var prefix = '';
                    if(minutes < 10){
                        prefix = ' 0';
                    }
                    ctx.fillText(prefix + minutes + ":" + seconds + " sec", (xValue + ctx.measureText(count + ". " + this.userName + " -").width + ctx.measureText(prefix + minutes + ":" + seconds + " sec").width + 10), yValue);
                }

                yValue += 40;

                count++;
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

var loadTimezoneStatistics = function(){

    var user = {
        'username': LoggedUser.username
    };

    if(typeof LoggedUser.list_of_friends != 'undefined'){
        $.each(LoggedUser.list_of_friends, function(){
            user[this.username] = this.username;
        });
    }

    $.ajax({
        type: 'POST',
        url: '/statistics/getTimezoneStatistics/',
        data: user,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            console.log(response.result);

            var xValue = 30;
            var yValue = 130;

            $.each(response.result, function(){
                var user = this;
                ctx.fillStyle = "Orange";
                ctx.font = 20 + "px Times New Roman";
                ctx.fillText(user._id, (xValue + ctx.measureText(user._id).width), yValue);

                yValue += 30;
                var internX = xValue + 30;

                $.each(user.games, function(){
                    if(yValue > 400){
                        xValue += 230;
                        internX = xValue + 30;
                        yValue = 130;
                    }

                    ctx.fillStyle = "White";
                    ctx.font = 18 + "px Times New Roman";
                    ctx.fillText(this.timezone, (internX + ctx.measureText(this.timezone).width), yValue);
                    ctx.fillText(this.percentCalculated.toFixed(2) + "%", (internX + 20 + ctx.measureText(this.timezone + "%").width + ctx.measureText(this.percentCalculated.toFixed(2) + "%").width), yValue);

                    yValue += 20;
                });

                yValue += 30;
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

Statistics.prototype.Tick = function(elapsed)
{
    this.RenderCanvas(elapsed);
    this.LoadStatistics(elapsed);
}