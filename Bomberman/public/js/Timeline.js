/**
 * Created by Victoria on 2/6/2016.
 */
Timeline = function(){
    //this.messages = getMessages(LoggedUser);
}

Timeline.prototype.RenderCanvas = function() {
    var lingrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    new CanvasSubmit(canvas, {
        x: 610,
        y: 20,
        fontSize: 16,
        width: 85,
        height: 35,
        placeholder: '',
        onSubmit: ( function () {
            $('#userList').css('display','inline-block');
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 20 + "px Times New Roman";
    ctx.fillText("Show All", 690, 25);

    new CanvasSubmit(canvas, {
        x: 715,
        y: 20,
        fontSize: 16,
        width: 65,
        height: 35,
        placeholder: '',
        onSubmit: ( function () {
            StartMainMenu();
            $('#userList').hide();
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 20 + "px Times New Roman";
    ctx.fillText("Menu", 770, 25);

    GameLoopManager.stop();
}

Timeline.prototype.LoadMessages = function() {
    /*ctx.fillStyle = "White";
    ctx.font = 25 + "px Times New Roman";
    ctx.fillText("f:", 10, (canvas.height - 30));

    var messageField = new CanvasText( canvas, {
        x: 20,
        y: (canvas.height - 30),
        fontSize: 16,
        width: 650,
        height: 35
    });

    new CanvasSubmit(canvas, {
        x: 690,
        y: (canvas.height - 30),
        fontSize: 16,
        width: 90,
        height: 35,
        placeholder: '',
        onSubmit: ( function () {
            sendMessage(messageField.value);
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 20 + "px Times New Roman";
    ctx.fillText("Send", 755, (canvas.height - 25));
*/
    //$('#messageText').show();
    //$('#sendMessage').show();
    //$('#sendMessage').click(sendMessage);
    getMessages();
}

Timeline.prototype.Tick = function(elapsed)
{
    this.RenderCanvas(elapsed);
    this.LoadMessages(elapsed);
}

function sendMessage(messageText){
    //console.log($("#messageText").val());

    var messageToInsert = {
        'author_id': LoggedUser.id,
        'author_name': LoggedUser.username,
        'messageDate': Date(),
        'messageText': messageText
    };

    $.ajax({
        type: 'POST',
        url: '/chat/addMessage/',
        data: messageToInsert,
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var lingrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            lingrad.addColorStop(0, '#000');
            lingrad.addColorStop(1, '#023');
            ctx.fillStyle = lingrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            new CanvasSubmit(canvas, {
                x: 610,
                y: 20,
                fontSize: 16,
                width: 85,
                height: 35,
                placeholder: '',
                onSubmit: ( function () {
                    $('#userList').css('display','inline-block');
                })
            });

            ctx.fillStyle = "White";
            ctx.font = 20 + "px Times New Roman";
            ctx.fillText("Show All", 690, 25);

            new CanvasSubmit(canvas, {
                x: 715,
                y: 20,
                fontSize: 16,
                width: 65,
                height: 35,
                placeholder: '',
                onSubmit: ( function () {
                    StartMainMenu();
                    $('#userList').hide();
                })
            });

            ctx.fillStyle = "White";
            ctx.font = 20 + "px Times New Roman";
            ctx.fillText("Menu", 770, 25);

            getMessages();
        }
        else {
            if(response.msg.code != 11000){
                alert('Error: ' + response.msg);
            }
        }
    });
}

function getMessages(){

    var userToGet = {
        'user_id': LoggedUser.id
    };

    var tableContent = '';

    $.ajax({
        type: 'POST',
        url: '/chat/getCurrentUserTimeline/',
        data: userToGet,
    }).done(function( response ) {
        // Check for a successful (blank) response
        console.log(response.msg);
        if (response.msg === '') {
            if(response.messages == ''){

            }else{

                var xValue = 20;
                var yValue = (canvas.height - 75); //60;

                $.each(response.messages, function(){
                    ctx.fillStyle = "Orange";
                    ctx.font = 23 + "px Times New Roman";
                    ctx.fillText(this.author_name + ': ', (xValue + ctx.measureText(this.author_name).width), yValue);

                    ctx.fillStyle = "White";
                    ctx.font = 23 + "px Times New Roman";
                    ctx.fillText(this.messageText, (xValue + ctx.measureText(this.author_name).width + ctx.measureText(this.messageText).width), yValue);

                    yValue -= 30;
                });

                $.each(response.messages, function(){
                    tableContent += '<tr>';
                    tableContent += '<td>' + this.author_name + '</a></td>';
                    tableContent += '<td>' + (new Date(this.messageDate)).toLocaleString() + '</td>';
                    tableContent += '<td>' + this.messageText + '</td>';
                    tableContent += '</tr>';
                });

                // Inject the whole content string into our existing HTML table
                $('#userList table tbody').html(tableContent);
            }
        }
        else {
            alert('Error: ' + response.msg);
        }
    });

    var messageField = new CanvasText( canvas, {
        x: 10,
        y: (canvas.height - 30),
        fontSize: 16,
        width: 660,
        height: 35,
        typeToCalculateSpace: 'MessageBox'
    });

    new CanvasSubmit(canvas, {
        x: 690,
        y: (canvas.height - 30),
        fontSize: 16,
        width: 90,
        height: 35,
        placeholder: '',
        typeToCalculateSpace: 'MessageBox',
        onSubmit: ( function () {
            sendMessage(messageField.value)
            messageField.value = '';
        })
    });

    ctx.fillStyle = "White";
    ctx.font = 22 + "px Times New Roman";
    ctx.fillText("Send", 755, (canvas.height - 23));
}