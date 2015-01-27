/**
 * @file Server routes definition
 * portion of this code is inspired by http://www.frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/
 * Copyright (c) 2013 Frederik Nakstad
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
var mysql = require('mysql'),
    conf = require('./server.conf.js'),
    pool = mysql.createPool({
        host: conf.db.host,
        user: conf.db.user,
        password: conf.db.password,
        database : conf.db.database
    }),
    api;

api = {
    openIssuesByTracker: function (req, res, next){
        // get parms
        // var query = req.params.filter,
        //     from = parseInt(req.params.from),
        //     to = parseInt(req.params.to);

        // check from, to (from < to)

        // connect db
        pool.getConnection(function(err, c){
            c.query('select t.name as tracker, is1.name as status, \
                        (select count(i.id) from issues i where i.project_id in (1, 3) and i.status_id = is1.id and i.tracker_id = t.id) as value \
                        from trackers t, issue_statuses is1 \
                        where \
                            is1.is_closed = 0;',
                [], 
                function (err, rows, fields){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.type('application/json');
                        res.send(rows);
                    }

                    // return connection back to the pool
                    c.release();
                }
            );
        });
    }
};


module.exports = api;