-- sum open and all
select (select count(i.id) from issues i
		inner join issue_statuses is2 on i.status_id = is2.id
		where
		 i.fixed_version_id in (6)
         and is2.is_closed = 1) as value,
         count(i.id) as value_all
	from issues i
    where
		 i.fixed_version_id in (6);

-- passed days / number of days 

-- open issues by tracker
select t.name as tracker, is1.name as status,
	(select count(i.id)
		from issues i
        inner join versions as v on i.fixed_version_id = v.id
        where ((i.project_id = 2 and v.name = "1.0.2") or
			(i.project_id = 3 and v.name = "1.0.2")) and
            i.status_id = is1.id and i.tracker_id = t.id) as value
	from trackers t, issue_statuses is1
    where
        is1.is_closed = 0;

select t.name, is1.name, count(i.id)
	from issues i
    inner join issue_statuses is1 on i.status_id = is1.id
    inner join users u on i.assigned_to_id = u.id
    inner join trackers t on i.tracker_id = t.id
    where
		i.project_id in (1, 3) and
        is1.is_closed = 0		
    group by t.name, is1.name;


-- (USED) open issues split by owner
select u.login, count(i.id)
	from issues i
    inner join issue_statuses is1 on i.status_id = is1.id
    inner join users u on i.assigned_to_id = u.id
    where
		i.project_id in (1, 2) and
        is1.is_closed = 0 
    group by u.login;


-- are we good?
SELECT Avg(a.Resolved)
	FROM (
		select LEFT(j.created_on, 10) AS 'Date', count(DISTINCT i.id) as 'Resolved' 
		from issues as i
        INNER JOIN journals as j ON i.id=j.journalized_id AND j.journalized_type='Issue'
		INNER JOIN journal_details as jd ON j.id=jd.journal_id AND jd.property='attr' AND jd.prop_key='status_id'
		inner join versions as v on i.fixed_version_id = v.id
		WHERE jd.value = 3
			and i.project_id in (1,2,3)
		group by Date
    ) as a;


-- resolved by date
SELECT LEFT(journals.created_on, 10) AS 'Date', COUNT(DISTINCT issues.id) AS 'Resolved' FROM issues
	INNER JOIN journals ON issues.id=journals.journalized_id AND journals.journalized_type='Issue'
	INNER JOIN journal_details ON journals.id=journal_details.journal_id AND journal_details.property='attr' AND journal_details.prop_key='status_id'
	inner join versions as v on issues.fixed_version_id = v.id
WHERE journal_details.value = 3 and
    issues.project_id in (1,2,3)
GROUP BY Date;


-- time entries for last 5 working days
SELECT t.spent_on, u.login, sum(t.hours) / 8 as MDs
	FROM time_entries as t
	inner join users as u on u.id = t.user_id 
	where t.project_id in (1, 2, 3) and
		t.spent_on > date_sub(curdate(), INTERVAL 6 day)
    group by t.spent_on, t.user_id;

-- time logged this week
SELECT SUM(t.hours) / 8 as value
	FROM time_entries as t
	where t.project_id in (1, 3)
		and yearweek(t.spent_on, 1) = yearweek(curdate(), 1);

-- open vs. closed for a version
select 'open', count(distinct i.id) as sumy
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
        (s1.is_closed = 0) and 
        (v.id in (6,9))
union
	select 'closed', count(distinct i.id) as sumy
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(s1.is_closed = 1) and 
        (v.id in (6,9));

-- number of critical open bugs
select count(i.id) as value
	from issues i
    left outer join issue_statuses s on i.status_id = s.id
    where priority_id in (4, 3) and
        fixed_version_id in (6) and
        s.is_closed = 0;


-- spent time on prudcts per activity
select e.name, 
		(select round(sum(t.hours) / 8, 2)
			from time_entries t
            where t.activity_id = e.id and
				project_id in (1, 2, 3)) as celkem
	from enumerations e
    where e.type = 'TimeEntryActivity';

-- (USED) days till the end
select 5 * (DATEDIFF(effective_date, curdate()) DIV 7) + MID('1234555512344445123333451222234511112345001234550', 7 * WEEKDAY(curdate()) + WEEKDAY(effective_date) + 1, 1) as value
	from versions
    where
		id = 6;

-- (USED) to do MDs
select sum((i.estimated_hours * (1 - i.done_ratio/100)))/8 as rest 
	from issues as i
    inner join issue_statuses as s1 on i.status_id = s1.id
    where
		i.fixed_version_id = 5
        and (i.category_id not in (select id from issue_categories where name = 'Administration')
            or i.category_id is null)
        and s1.is_closed = 0
        and parent_id is null
        ;


-- version status
select i.id as ID, i.subject, s1.name as status, p.name,
		IFNULL(round((select sum(t.hours) from time_entries as t where t.issue_id = i.id) / 8, 2),0) as spent,
        round(i.estimated_hours / 8, 2) as estimate,
        round((i.estimated_hours - ifnull((select sum(t.hours) from time_entries as t where t.issue_id = i.id),0)) / 8, 2) as rest,
        i.done_ratio as done
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(v.id in (6, 9) ) and
        (s1.name != 'Closed' and s1.name != 'Resolved')
union
	select i.id as ID, i.subject, s1.name as status, p.name,
		round((select sum(t.hours) from time_entries as t where t.issue_id = i.id) / 8, 2) as spent,
        round(i.estimated_hours / 8, 2) as estimate,
        0 as rest,
        i.done_ratio as done
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(v.id in (6.9) ) and
        (s1.name = 'Closed' or s1.name = 'Resolved');

