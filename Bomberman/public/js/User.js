/**
 * Created by Victoria on 2/1/2016.
 */
User = function(id, username, email, registration_date, gamesPlayed, number_of_friends, list_of_friends, invites)
{
    this.id = id;
    this.username = username;
    this.email = email;
    this.registration_date = registration_date;
    this.gamesPlayed = gamesPlayed;
    this.number_of_friends = number_of_friends;
    this.list_of_friends = list_of_friends;
    this.invites = invites;
}

User.prototype.constructor = User;

User.prototype.RenderProfile = function()
{
    var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    new CanvasSubmit( canvas, {
        x: 700,
        y: 20,
        fontSize: 16,
        width: 65,
        height: 35,
        placeholder: '',
        onSubmit: ( function() {
            $('#userList').hide();
            StartMainMenu();
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 20 + "px Times New Roman";
    ctx.fillText("Menu", 755, 25);

    ctx.fillStyle = "White";
    ctx.font = 30 + "px Times New Roman";
    ctx.fillText("Your profile", canvas.width/2 + 80, 70);

    LoadUserInfo(this);
    LoadUserFriends(this);
}

var LoadUserInfo = function(self){
    ctx.fillStyle = "Orange";
    ctx.font = 26 + "px Times New Roman";
    ctx.fillText("USER INFO", 270, 160);

    ctx.moveTo(272,153);
    ctx.lineTo(390,153);
    ctx.lineTo(390,410);
    ctx.lineTo(10,410);
    ctx.lineTo(10,153);
    ctx.lineTo(136,153);
    ctx.strokeStyle="#fff";
    ctx.stroke();

    var yValue = 210;
    var xValue = 160;

    ctx.fillStyle = "Orange";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Username:", xValue, yValue);

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText(self.username, (xValue + ctx.measureText(self.username).width + 10), yValue);

    yValue += 40;

    ctx.fillStyle = "Orange";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Email:", xValue, yValue);

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText(self.email, (xValue + ctx.measureText(self.email).width + 10), yValue);

    yValue += 40;

    ctx.fillStyle = "Orange";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Register Date:", xValue, yValue);


    ctx.fillStyle = "White";
    ctx.font = 22 + "px Times New Roman";
    ctx.fillText(self.registration_date, (xValue + ctx.measureText(self.registration_date).width + 10), yValue);

    yValue += 40;

    ctx.fillStyle = "Orange";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Games:", xValue, yValue);

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText(self.gamesPlayed, (xValue + ctx.measureText(self.gamesPlayed).width + 10), yValue);

    yValue += 40;

    ctx.fillStyle = "Orange";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("Friends:", xValue, yValue);

    ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText(self.number_of_friends, (xValue + ctx.measureText(self.number_of_friends).width + 10), yValue);
}

var LoadUserFriends = function(self){

    ctx.fillStyle = "Orange";
    ctx.font = 26 + "px Times New Roman";
    ctx.fillText("USER FRIENDS", 720, 160);

    ctx.moveTo(722,153);
    ctx.lineTo(790,153);
    ctx.lineTo(790,410);
    ctx.lineTo(450,410);
    ctx.lineTo(450,153);
    ctx.lineTo(538,153);
    ctx.strokeStyle="#fff";
    ctx.stroke();

    var yValue = 210;
    var xValue = 470;

    for(var i=0; i<self.list_of_friends.length; i++){

        if(i == 4){
            break;
        }

        ctx.fillStyle = "White";
        ctx.font = 25 + "px Times New Roman";
        ctx.fillText(self.list_of_friends[i].username, (xValue + ctx.measureText(self.list_of_friends[i].username).width), yValue);

        yValue += 40;
    }

    new CanvasSubmit( canvas, {
        x: 690,
        y: 205,
        fontSize: 16,
        width: 85,
        height: 35,
        placeholder: "",
        onSubmit: ( function() {

            var tableContent = '';

            $.each(self.list_of_friends, function(){
                tableContent += '<tr>';
                tableContent += '<td>' + this.username + '</a></td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#userList table tbody').html(tableContent);
            $('#userList').css('display','inline-block');
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 18 + "px Times New Roman";
    ctx.fillText("All friends", 770, 210);

    new CanvasSubmit( canvas, {
        x: 690,
        y: 260,
        fontSize: 16,
        width: 85,
        height: 35,
        placeholder: "",
        onSubmit: ( function() {
            var tableContent = '';

            $.each(self.invites, function(){
                tableContent += '<tr>';
                tableContent += '<td>' + this.username + '</a></td>';
                tableContent += '<td><a href="#" class="linkAddUserToFriends" current_username="' + self.username + '" current_user="' + self.id + '" friend_user="' + this.user_id + '" friend_username="' + this.username + '">Accept</a></td>';
                tableContent += '<td><a href="#" class="linkDeclineInvitation" current_username="' + self.username + '" current_user="' + self.id + '" friend_user="' + this.user_id + '" friend_username="' + this.username + '">Decline</a></td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#userList table tbody').html(tableContent);
            $('#userList table tbody tr td a.linkAddUserToFriends').click(acceptFriendship);
            $('#userList table tbody tr td a.linkDeclineInvitation').click(declineFriendship);
            $('#userList').css('display','inline-block');
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 18 + "px Times New Roman";
    ctx.fillText("Invitations", 770, 265);

    new CanvasSubmit( canvas, {
        x: 690,
        y: 315,
        fontSize: 16,
        width: 85,
        height: 35,
        placeholder: "",
        onSubmit: ( function() {

            var tableContent = '';
            $.getJSON( '/user/userlist', function( data ) {

                $.each(data, function(){
                    tableContent += '<tr>';
                    tableContent += '<td>' + this.username + '</a></td>';
                    tableContent += '<td>' + this.email + '</td>';
                    tableContent += '<td><a href="#" class="linkSendInvitation" current_username="' + self.username + '" current_user="' + self.id + '" friend_user="' + this._id + '">Send Invitation</a></td>';
                    tableContent += '</tr>';
                });

                // Inject the whole content string into our existing HTML table
                $('#userList table tbody').html(tableContent);
                $('#userList table tbody tr td a.linkSendInvitation').click(sendInvitation);
                $('#userList').css('display','inline-block');
            });
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 18 + "px Times New Roman";
    ctx.fillText("Add friend", 770, 320);

    new CanvasSubmit( canvas, {
        x: 690,
        y: 370,
        fontSize: 16,
        width: 85,
        height: 35,
        placeholder: "",
        onSubmit: ( function() {

            var tableContent = '';

            $.each(self.list_of_friends, function(){
                tableContent += '<tr>';
                tableContent += '<td>' + this.username + '</a></td>';
                tableContent += '<td><a href="#" class="linkRemoveUserFromfriends" current_user="' + self.id + '" friend_user="' + this.user_id + '">Remove</a></td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#userList table tbody').html(tableContent);
            $('#userList table tbody tr td a.linkRemoveUserFromfriends').click(deleteUserFromFriends);
            $('#userList').css('display','inline-block');
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 18 + "px Times New Roman";
    ctx.fillText("Remove frs", 775, 375);
}

//method to send invitation
function sendInvitation(self) {
    var invite = {
        'userId': $(this).attr('current_user'),
        'userName': $(this).attr('current_username'),
        'friendId': $(this).attr('friend_user')
    };

    $.ajax({
        type: 'POST',
        url: '/user/sendFriendshipInvitation/',
        data: invite,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            alert('You have successfully sent friendship invitation.');
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
};

//method to add user to list of friends
function acceptFriendship(self) {
    var addToUser = {
        'userId': $(this).attr('current_user'),
        'userName': $(this).attr('current_username'),
        'friendId': $(this).attr('friend_user'),
        'friendUsername': $(this).attr('friend_username')
    };

    $.ajax({
        type: 'POST',
        url: '/user/addToFriends/',
        data: addToUser,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            alert("You have successfully accepted this friendship invitation");
        }
        else {
            alert('Error: ' + response.msg);
        }
     });
};

function declineFriendship(self) {
    var addToUser = {
        'userId': $(this).attr('current_user'),
        'userName': $(this).attr('current_username'),
        'friendId': $(this).attr('friend_user'),
        'friendUsername': $(this).attr('friend_username')
    };

    $.ajax({
        type: 'POST',
        url: '/user/declineInvitation/',
        data: addToUser,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            alert("You have successfully declined this friendship invitation");
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
};

//method to delete user from list of friends
function deleteUserFromFriends(self) {
    var deleteFomUserFriends = {
        'userId': $(this).attr('current_user'),
        'friendId': $(this).attr('friend_user')
    };

    $.ajax({
        type: 'POST',
        url: '/user/deleteuser/',
        data: deleteFomUserFriends,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            alert('You have successfully deleted this user from your friendlist');
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
};

User.prototype.Tick = function(elapsed)
{
    //this.Logic(elapsed);
    this.RenderProfile(elapsed);
}