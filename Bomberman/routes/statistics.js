/**
 * Created by Victoria on 1/31/2016.
 */
var express = require('express');
var router = express.Router();

router.post('/getTopThreeDependingOnNumberOfWonGames', function(req, res) {
    var db = req.db;
    var collection = db.get('games');

    var usernames = [];

    for (key in req.body) {
        usernames.push(req.body[key]);
    }

    collection.col.aggregate([
        {
            $match:
            {
                "userName": {$in: usernames},
                "win" : "true"
            }
        },
        {
            $group:
            {
                _id: "$userName",
                totalGamesPlayed : {
                    $sum: 1
                }
            }
        },
        {
            $sort:{
                totalGamesPlayed: -1
            }
        },
        {
            $limit: 3
        }
    ],function(err,result) {
        res.send(
            (err === null) ? { msg: '', result: result } : { msg: err, result: ''}
        );
    });

});

router.post('/getTopThreeFastestGames', function(req, res) {
    var db = req.db;
    var collection = db.get('games');

    var usernames = [];

    for (key in req.body) {
        usernames.push(req.body[key]);
    }

    collection.col.aggregate([
        {
            $match:
            {
                "userName": {$in: usernames},
                "win" : "true"
            }
        },
        {
            $project:
            {
                userName: 1,
                time: 1
            }
        },
        {
            $sort:{
                time: 1
            }
        },
        {
            $limit: 3
        }
    ],function(err,result) {
        res.send(
            (err === null) ? { msg: '', result: result } : { msg: err, result: ''}
        );
    });
});

router.post('/getTimezoneStatistics', function(req, res) {
    var db = req.db;
    var collection = db.get('games');

    var usernames = [];

    for (key in req.body) {
        usernames.push(req.body[key]);
    }

    collection.col.aggregate([
        {
            $match:
            {
                "userName": {$in: usernames}
            }
        },
        {
            $group:
            {
                _id: {
                    timezone: "$timezone",
                    username: "$userName"
                },
                totalGamesPlayed : {
                    $sum: 1
                }
            }
        },
        {
            $group: {
                "_id": "$_id.username",
                "games": {
                    "$push": {
                        "timezone": "$_id.timezone" ,
                        "count": "$totalGamesPlayed"
                    },
                },
                "gamesPlayedAll": {"$sum": "$totalGamesPlayed"}
            }
        },
        {
            $unwind: "$games"
        },
        {
            $group: {
                "_id": "$_id",
                "games": {
                    "$push": {
                        "timezone": "$games.timezone" ,
                        "count": "$games.count",
                        "all": "$gamesPlayedAll",
                        "percentCalculated": {
                            $multiply :
                                [100, {$divide: [ "$games.count", "$gamesPlayedAll" ]} ]
                        }
                    },
                },
            }
        },
    ],function(err,result) {
        res.send(
            (err === null) ? { msg: '', result: result } : { msg: err, result: ''}
        );
    });
});

module.exports = router;