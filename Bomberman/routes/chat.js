/**
 * Created by Victoria on 1/31/2016.
 */
var express = require('express');
var router = express.Router();

//add new message
router.post('/addMessage', function(req, res) {
    var db = req.db;
    var collection = db.get('messages');

    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//add new message
router.post('/getCurrentUserTimeline', function(req, res) {
    var db = req.db;
    var collectionMessages = db.get('messages');
    var collectionUsers = db.get('users');

    var userToGet = req.body['user_id'];

    /*collectionUsers.col.aggregate([
        {
            $match:
                    {
                        "username": "user1"
                    }
        },
        {
            $project:
                    {
                        list_of_friends:1,
                        username:0,
                        email:0,
                        password:0,
                        registration_date:0,
                        invites:0,
                        _id: 1
                    }
        }
    ],function(err,result) {
        res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
    });*/

    var friendsIds = [];
    friendsIds.push(userToGet);

    collectionUsers.find({_id: userToGet},{},function(err,docs){

        if(typeof docs[0].list_of_friends != 'undefined'){
            docs[0].list_of_friends.forEach(function(err,doc){
                friendsIds.push(docs[0].list_of_friends[doc].user_id);
            });
        }

        collectionMessages.find({author_id: { $in: friendsIds}},{sort: {messageDate: -1}},function(err,docs){
            res.send(
                (err === null) ? { msg: '', messages: docs} : { msg: err, messages: ''}
            );
        });
        /*docs[0].list_of_friends.forEach(function(err,doc){
            /*res.send(
                (err === null) ? { msg: docs[0].list_of_friends} : { msg: err }
            );
            //res.json(docs);
        });*/
    });
});

module.exports = router;