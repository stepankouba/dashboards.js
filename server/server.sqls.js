/**
 * @file Server routes definition
 * portion of this code is inspired by http://www.frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/
 * Copyright (c) 2013 Frederik Nakstad
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */

var sqls = {
    validVersions: 'select * from versions \
                    where project_id in (?) and \
                        status = \'open\' and \
                        date_format(effective_date, \'%Y-%m\')=date_format(now(), \'%Y-%m\');',

    openIssuesByTracker: 'select t.id as trackerId, t.name as tracker, is1.id as statusId, is1.name as status, \
                            (select count(i.id) \
                                from issues i \
                                inner join versions as v on i.fixed_version_id = v.id \
                                where (v.id in (?)) and \
                                i.status_id = is1.id and \
                                i.tracker_id = t.id) as value \
                        from trackers t, issue_statuses is1 \
                        where \
                            is1.is_closed = 0;',
                    
    openIssuesByAssignee: 'select u.id as id, u.login as text, count(i.id) as value \
                            from issues i \
                            inner join issue_statuses is1 on i.status_id = is1.id \
                            inner join users u on i.assigned_to_id = u.id \
                            inner join versions as v on i.fixed_version_id = v.id \
                            where \
                                (v.id in (?)) and \
                                is1.is_closed = 0 \
                            group by u.login;',

    openIssuesWithSeverity: 'select count(i.id) as value \
                        from issues i \
                        left outer join issue_statuses s on i.status_id = s.id \
                        where priority_id in (?) \
                            and fixed_version_id in (?) \
                            and s.is_closed = 0;',

    mdsToDoForVersion: 'select truncate(sum((i.estimated_hours * (1 - i.done_ratio/100)))/8, 2) as value \
                        from issues as i \
                        inner join issue_statuses as s1 on i.status_id = s1.id \
                        where \
                            i.fixed_version_id in (?) \
                            and (i.category_id not in (select id from issue_categories where name = \'Administration\') \
                                or i.category_id is null) \
                            and s1.is_closed = 0 \
                            and parent_id is null;',

    daysForVersion: 'select 5 * (DATEDIFF(effective_date, curdate()) DIV 7) + MID(\'1234555512344445123333451222234511112345001234550\', 7 * WEEKDAY(curdate()) + WEEKDAY(effective_date) + 1, 1) as value \
                    from versions \
                    where \
                        id in (?);',

    mdsFromStart: 'select round(sum(t.hours) / 8, 2) as value \
                    from time_entries t \
                    where \
                        project_id in (?);',

    mdsFiveDaysActive: 'SELECT DISTINCT u.login as text, \
                    (select ifnull(round(sum(t.hours) / 8, 2), 0) \
                        from time_entries as t \
                        where t.project_id in (?) \
                            and t.spent_on > date_sub(curdate(), INTERVAL 6 day) \
                            and t.user_id = u.id \
                    ) as value \
                    FROM journals as j \
                    inner join users as u on u.id = j.user_id \
                    where \
                        date(j.created_on) > date_sub(curdate(), INTERVAL 10 day);',

    avgIssuesChangedToStatus: 'SELECT round(avg(a.Resolved), 2) as value \
                    FROM ( \
                        select LEFT(j.created_on, 10) AS \'Date\', count(DISTINCT i.id) as \'Resolved\' \
                        from issues as i \
                        INNER JOIN journals as j ON i.id=j.journalized_id AND j.journalized_type=\'Issue\' \
                        INNER JOIN journal_details as jd ON j.id=jd.journal_id AND jd.property=\'attr\' AND jd.prop_key=\'status_id\' \
                        inner join versions as v on i.fixed_version_id = v.id \
                        WHERE jd.value = ? \
                            and i.project_id in (?) \
                        group by Date \
                    ) as a;',

    mdsFromLastWeek: 'SELECT round(SUM(t.hours) / 8,2) as value \
                    FROM time_entries as t \
                    where t.project_id in (?) \
                        and t.tweek = weekofyear(curdate()) - 1;',
};


module.exports = sqls;