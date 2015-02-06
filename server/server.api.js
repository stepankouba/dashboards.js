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
        database: conf.db.database
    }),
    api;

api = {
    validVersions: function(req, res, next) {
        var projects = req.params.projects;

        projects = projects.split(',');

        if (projects.length !== 2)
            throw new Error('openIssuesByTracker: wrong length of parameters.');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query('select * from versions \
                    where project_id in (?, ?) and \
                        status = \'open\' and \
                        date_format(effective_date, \'%Y-%m\')=date_format(now(), \'%Y-%m\');',
                    [projects[0], projects[1]], 
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
            }
        });
    },

    openIssuesByTracker: function (req, res, next){
        // get parms
        var versions = req.params.versions.split(',');

        if (versions.length !== 2)
            throw new Error('openIssuesByTracker: wrong length of parameters.');
        
        // connect db
        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query('select t.id as trackerId, t.name as tracker, is1.id as statusId, is1.name as status, \
                            (select count(i.id) \
                                from issues i \
                                inner join versions as v on i.fixed_version_id = v.id \
                                where (v.id in (?)) and \
                                i.status_id = is1.id and \
                                i.tracker_id = t.id) as value \
                        from trackers t, issue_statuses is1 \
                        where \
                            is1.is_closed = 0;',
                    [versions], 
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
            }
        });
    },
    openIssuesByAssignee: function (req, res, next){
        // get parms
        var versions = req.params.versions.split(',');

        if (versions.length !== 2)
            throw new Error('openIssuesByTracker: wrong length of parameters.');

        // connect db
        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query('select u.id as id, u.login as text, count(i.id) as value \
                            from issues i \
                            inner join issue_statuses is1 on i.status_id = is1.id \
                            inner join users u on i.assigned_to_id = u.id \
                            inner join versions as v on i.fixed_version_id = v.id \
                            where \
                                (v.id in (?)) and \
                                is1.is_closed = 0 \
                            group by u.login;',

                    [versions], 
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
            }
        });
    }
};


module.exports = api;