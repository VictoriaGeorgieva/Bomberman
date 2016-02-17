/**
 * Created by Victoria on 1/31/2016.
 */
var express = require('express');
var router = express.Router();
var hash = require("password-hash");

//get all users in database.
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

//get user friends
router.get('/getUserFriends/:id',function(req, res){
    var db = req.db;
    var collection = db.get('users');
    var userToGet = req.params.id;

    collection.find({_id: userToGet},{},function(e,docs){
        res.json(docs);
    });
});

//login user.
router.post('/login', function(req, res) {
    var db = req.db;
    var collection = db.get('users');

    var username = req.body['username'];
    var password = req.body['password'];

    collection.find({username: username},{},function(e,docs){

        var user = '';
        for(var i=0; i<docs.length; i++){
            if(hash.verify(password, docs[i].password) == true){
                user = docs[i];
            }
        }

        res.send(
            (e === null) ? { msg: '', user: user } : { msg: e, user: '' }
        );
    });
});

//register new user
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('users');

    req.body['password'] = hash.generate(req.body['password']);
    //hash.verify('pass123', hashed)

    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//send user invite
router.post('/sendFriendshipInvitation', function(req, res){
    var db = req.db;
    var collection = db.get('users');

    collection.update({_id: req.body['friendId']},{$addToSet: {invites: {user_id: req.body['userId'], username: req.body['userName']}}}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//add user to friends
router.post('/addToFriends', function(req, res){
    var db = req.db;
    var collection = db.get('users');

    collection.update({_id: req.body['userId']},{$addToSet: {list_of_friends: {user_id: req.body['friendId'], username: req.body['friendUsername']}}}, function(err, result){
        collection.update({_id: req.body['friendId']},{$addToSet: {list_of_friends: {user_id: req.body['userId'], username: req.body['userName']}}}, function(err, result){
            collection.update({_id: req.body['userId']},{$pull: {invites: {user_id: req.body['friendId']}}}, function(err, result){
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            });
        });
    });
});

//remove invitation - decline
router.post('/declineInvitation', function (req, res) {
    var db = req.db;
    var collection = db.get('users');

    collection.update({_id: req.body['userId']},{$pull: {invites: {user_id: req.body['friendId']}}}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//post to delete user from friends.
router.post('/deleteuser', function(req, res) {
    var db = req.db;
    var collection = db.get('users');

    collection.update({_id: req.body['userId']},{$pull: {list_of_friends: {user_id: req.body['friendId']}}}, function(err, result){
        collection.update({_id: req.body['friendId']},{$pull: {list_of_friends: {user_id: req.body['userId']}}}, function(err, result){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });
    });
});

//get currenct user info
router.get('/user/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    var userToGet = req.params.id;

    collection.find({_id: userToGet},{limit:1},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;