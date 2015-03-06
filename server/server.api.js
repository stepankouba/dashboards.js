/**
 * @file Server routes definition
 * portion of this code is inspired by http://www.frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/
 * Copyright (c) 2013 Frederik Nakstad
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
var mysql = require('mysql'),
    conf = require('./server.conf.js'),
    sqls = require('./server.sqls.js'),
    Q = require('Q'),
    pool = mysql.createPool({
        host: conf.db.host,
        user: conf.db.user,
        password: conf.db.password,
        database: conf.db.database
    }),
    api;

api = {
    validVersions: function(req, res, next) {
        var project = req.params.project;

        project = project.split(',');

        if (project.length === 0)
            throw new Error('openIssuesByTracker: wrong length of parameters.');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.validVersions,
                    [project], 
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

        if (versions.length === 0)
            throw new Error('openIssuesByTracker: wrong length of parameters.');
        
        // connect db
        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.openIssuesByTracker,
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

        if (versions.length === 0)
            throw new Error('openIssuesByTracker: wrong length of parameters.');

        // connect db
        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.openIssuesByAssignee,
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
    openIssuesWithSeverity: function(req, res, next){
        var severity = req.params.severity.split(','),
            versions = req.params.versions.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.openIssuesWithSeverity,
                        [severity, versions],
                        function(err, rows, fields){
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                console.log(rows);
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
    mdsToDoForVersion: function(req,res,next) {
        var versions = req.params.versions.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.mdsToDoForVersion,
                    [versions],
                    function(err, rows, fields){
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
    mdsToDoAverageForVersion: function(req,res,next) {
        var versions = req.params.versions.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                var queryFn = Q.nbind(c.query,c);

                Q.all([queryFn(sqls.mdsToDoForVersion, [versions]), queryFn(sqls.daysForVersion, [versions])])
                    .then(function(r){
                        var response = [];
                        // used simple mds / days in graph
                        response.push({value: Math.round(r[0][0][0].value / r[1][0][0].value * 100) / 100});

                        res.type('application/json');
                        res.send(response);

                        // return connection back to the pool
                        c.release();
                    })
                    .catch(function(err){
                        console.log(err);
                        res.sendStatus(500);

                        // return connection back to the pool
                        c.release();
                    });
                
            }
        });
    },
    avgIssuesChangedToStatus: function(req, res, next) {
        var status = req.params.status,
            projects = req.params.projects.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.avgIssuesChangedToStatus,
                        [status, projects],
                        function(err, rows, fields){
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                res.type('application/json');
                                res.send(rows);
                            }

                            c.release();
                        }
                );
            }
        });

    },
    mdsFromStart: function(req, res, next) {
        var projects = req.params.projects.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.mdsFromStart,
                        [projects],
                        function(err, rows, fields){
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                res.type('application/json');
                                res.send(rows);
                            }

                            c.release();
                        }
                );
            }
        });
    },
    mdsFiveDaysActive: function(req, res, next) {
        var projects = req.params.projects.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.mdsFiveDaysActive,
                        [projects],
                        function(err, rows, fields){
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                res.type('application/json');
                                res.send(rows);
                            }

                            c.release();
                        }
                );
            }
        });
    },
    mdsFromLastWeek: function(req, res, next) {
        var projects = req.params.projects.split(',');

        pool.getConnection(function(err, c){
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                c.query(sqls.mdsFromLastWeek,
                        [projects],
                        function(err, rows, fields){
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                res.type('application/json');
                                res.send(rows);
                            }

                            c.release();
                        }
                );
            }
        });
    },
};


module.exports = api;