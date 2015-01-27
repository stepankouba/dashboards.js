-- open issues by tracker
select t.name as tracker, is1.name as status,
	(select count(i.id) from issues i where i.project_id in (1, 3) and i.status_id = is1.id and i.tracker_id = t.id) as value
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



-- open issues split by owner
select u.login, is1.name, count(i.id)
	from issues i
    inner join issue_statuses is1 on i.status_id = is1.id
    inner join users u on i.assigned_to_id = u.id
    where
		i.project_id in (1, 3) and
        is1.is_closed = 0		
    group by u.login, is1.name;



-- resolved by date
SELECT LEFT(journals.created_on, 10) AS 'Date', COUNT(DISTINCT issues.id) AS 'Resolved' FROM issues
	INNER JOIN journals ON issues.id=journals.journalized_id AND journals.journalized_type='Issue'
	INNER JOIN journal_details ON journals.id=journal_details.journal_id AND journal_details.property='attr' AND journal_details.prop_key='status_id'
	inner join versions as v on issues.fixed_version_id = v.id
WHERE journal_details.value = 3 and
	issues.project_id in (1,2,3) and
    v.name = '1.0.2'
GROUP BY Date;


-- time entries for last 5 working days
SELECT t.spent_on, u.login, sum(t.hours) / 8 as MDs
	FROM time_entries as t
	inner join users as u on u.id = t.user_id 
	where t.project_id in (1, 2, 3) and
		t.spent_on > date_sub(curdate(), INTERVAL 6 day)
    group by t.spent_on, t.user_id;


-- open vs. closed for a version
select 'open', count(distinct i.id) as sumy
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(p.id in (1, 2, 3) ) and
        (s1.is_closed = 0) and 
        (v.name = '1.0.2')
union
	select 'closed', count(distinct i.id) as sumy
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(p.id in (1, 2, 3) ) and
        (s1.is_closed = 1) and 
        (v.name = '1.0.2');

-- number of critical open bugs
select count(i.id)
	from issues i
    left outer join issue_statuses s on i.status_id = s.id
    where priority_id = 4 and
		tracker_id = 1 and
        project_id in (1, 3) and
        s.is_closed = 0;

-- number of MDs to do
select  (select sum(t.hours) from time_entries as t where t.issue_id = i.id) as rest
        from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(p.id in (1, 3) ) and
        (s1.name != 'Closed' or s1.name != 'Resolved') and 
        (v.name = '1.0.2');


-- spent time on prudcts per activity
select e.name, 
		(select round(sum(t.hours) / 8, 2)
			from time_entries t
            where t.activity_id = e.id and
				project_id in (1, 2, 3)) as celkem
	from enumerations e
    where e.type = 'TimeEntryActivity';


-- version status
select i.id as ID, i.subject, s1.name as status, p.name,
		round((select sum(t.hours) from time_entries as t where t.issue_id = i.id) / 8, 2) as spent,
        round(i.estimated_hours / 8, 2) as estimate,
        round((i.estimated_hours - (select sum(t.hours) from time_entries as t where t.issue_id = i.id)) / 8, 2) as rest,
        i.done_ratio as done
	from issues as i
		inner join issue_statuses as s1 on i.status_id = s1.id
        inner join projects as p on i.project_id = p.id
        inner join versions as v on i.fixed_version_id = v.id
	where
		(p.id in (1, 2, 3) ) and
        (s1.name != 'Closed' and s1.name != 'Resolved') and 
        (v.name = '1.0.2')
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
		(p.id in (1, 2, 3) ) and
        (s1.name = 'Closed' or s1.name = 'Resolved') and 
        (v.name = '1.0.2');

