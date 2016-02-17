/**
 * Created by Victoria on 1/31/2016.
 */
var express = require('express');
var router = express.Router();

//register new user
router.post('/addGame', function(req, res) {
    var db = req.db;
    var collection = db.get('games');

    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;