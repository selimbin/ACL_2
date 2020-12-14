# ACL
our tables should look like this 
Staff(staffid, staffname, email, salary, locationid, deptid, role, dayoff, hoursspent, accumelatedhours)
faculty(facultyid, name) 
department( deptid, facultyid, name) 
course(courseid, name, staffifd, deptid, coverage) 
location(building, staffid, type, capacity, slotid) 
missingday(staffid, day, month) 
attendance(staffid, day, signin, signout, attended/absent)
any changes should be discused or requested on discord or github
thx you

