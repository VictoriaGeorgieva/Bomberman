/**
 * Created by Victoria on 2/6/2016.
 */
Message = function(message_id, author_id, author_username, message_date, message_content)
{
    this.message_id = message_id;
    this.author_id = author_id;
    this.author_username = author_username;
    this.message_date = message_date;
    this.message_content = message_content;
}

Message.prototype.constructor = Message;