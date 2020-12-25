# ACL
**Some of these tables were change on the latest merge to main**
Our tables should look like this 
Staff(staffid, staffname, email, salary, locationid, deptid, role, dayoff, hoursspent, accumelatedhours)
faculty(facultyid, name) 
department( deptid, facultyid, name) 
course(courseid, name, staffifd, deptid, coverage) 
location(building, staffid, type, capacity, slotid) 
missingday(staffid, day, month) 
attendance(staffid, day, signin, signout, attended/absent)
Any changes should be discused or requested on discord or github
  Thank You

  HR routes:---------------------------------------------------------------------------------------------------------------------------------------
-- Note that for each one of these routes the user needs to be logged in an HR account or an error message "unauthorized" will be displayed

1-  Functionality: Adds a Location to the System
	Route: /staff/AddLocation
	Request type: POST
	Request body: {"Code":"C3-105","Building":"C3","Type":"lab","Capacity":6}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a location that already exists. otherwise, Location will be added.

2-  Functionality: Updates a Location on the System
	Route: /staff/UpdateLocation
	Request type: PUT
	Request body: {"Code":"C3-105","newCode":"C7-305","Building":"C7","Type":"office","Capacity":8}
	Parameters: Code is the code of the location to be changed, newCode,Building,Type,Capacity are all the new values for this location
	Any missing value will be replaced by the original one.
	for example:{"Code"="C3-105","newCode"="C7-305","Building"="C7"}, the code and building will be the only ones to change while
	the rest are the same.
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a location that doesnt exist or the newCode already exists or trying to change an office with staff 
	still in it to any other type of location or changing the capacity of location to a number smaller than
	the number of staff in it. otherwise, Location will be Deleted.

3-  Functionality: Deletes a Location From the System
	Route: /staff/DeleteLocation
	Request type: DELETE
	Request body: {"Code":"C7-305"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a location that doesnt exist. otherwise, Location will be updated.

4-  Functionality: Adds a Faculty to the System
	Route: /staff/AddFaculty
	Request type: POST
	Request body: {"Name":"Engineering"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a faculty that already exists. otherwise, Faculty will be added.

5-  Functionality: Updates a Faculty on the System
	Route: /staff/UpdateFaculty
	Request type: PUT
	Request body: {"Name":"Engineering","newName":"Pharmacy"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a Faculty that doesn't exist or there is a faculty with newName on the system,otherwise Faculty will be Updated.

6-  Functionality: Deletes a Faculty From the System
	Route: /staff/DeleteFaculty
	Request type: DELETE
	Request body: {"Name":"Pharmacy"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a Faculty that doesnt exist. otherwise, Faculty will be Deleted.

7-  Functionality: Adds a Department to a Faculty in the System
	Route: /staff/AddDepartment
	Request type: POST
	Request body: {"FacultyName":"Engineering","DepartmentName":"MET","Head":"ac-4"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a faculty that doesn't exist or a department name that already exists
	or if the head id doesn't exist in the system. otherwise, Department will be added.

8-  Functionality: Updates a Department under a faculty on the System
	Route: /staff/UpdateDepartment
	Request type: PUT
	Request body: {"FacultyName":"Engineering","DepartmentName":"MET","newDepartmentName":"biotechnology","newFacultyname":"Pharmacy","newHead":"ac-4"}
	Parameters: FacultyName and DepartmentName needs are the name of the department and its faculty, newDepartmentName is for changing the department name,
	newFacultyname is for changing the faculty of this department, and newHead is for changing the head of the department
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a faculty that doesn't exist or a department name that doesn't exist or if the department doesn't belong to the entered faculty
	or if the head id doesn't exist in the system. otherwise, Department will be Updated.

9-  Functionality: Deletes a Department From a faculty on the System
	Route: /staff/DeleteDepartment
	Request type: DELETE
	Request body: {"FacultyName":"Pharmacy","Name":"biotechnology"}
	Parameters: Name is the name of the department to be deleted
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a Faculty that doesnt exist or a department that doesn't exist or the department
	belong to the entered faculty. otherwise, Department will be Deleted.

10- Functionality: Adds a course to a department in the System
	Route: /staff/AddCourse
	Request type: POST
	Request body: {"Departmentname":"MET","Code":"CSEN703","totalSlots":6}
	Parameters: Department name is the department the course with course code "Code" should be added to and the
	totalSlots are the required slots for this course to be fully covered. the coverage is default 0 when a new course is added
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a department that doesn't exist or a course code that already exists
	or if the totalslots number is invalid. otherwise, Department will be added.

11- Functionality: Updates a course under a department on the System
	Route: /staff/UpdateCourse
	Request type: PUT
	Request body: {"Departmentname":"MET","Code":"CSEN703","newDepartmentname":"DMET","newCode":"DMET701","totalslots":10}
	Parameters: Departmentname and Code are the name of the department and code of the course to be updated, newDepartmentName is for changing the department 
	of this course, newCode is for changing the name of this course, and totalslots is for changing the required number of slots for this course, coverage is updated automatically
	when a staff is assigned a course in a slot so it can't be manually updated here to avoid inconsistency.
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a department that doesn't exist or a course code doesn't exist or if the course doesn't belong to the entered department
	or if the totalslots is invalid (negative or lower than already assigned slots). otherwise, course will be Updated.

12-	Functionality: Deletes a course From a department on the System
	Route: /staff/DeleteCourse
	Request type: DELETE
	Request body: {"Departmentname":"DMET","Code":"DMET701"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a department that doesnt exist or a course that doesn't exist or the course
	doesnt belong to the entered department. otherwise, course will be Deleted.

13-	Functionality: Adds a staff to the System
	Route: /staff/AddStaff
	Request type: POST
	Request body: {"name":"Ali Saad","email":"ali.othman@student.guc.edu.eg","salary":6000,"officelocation":"C3-301","role":"HR","dayoff":"Saturday","department":"","gender":"M"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of an invalid email,salary,officelocation that doesnt exist,role,dayoff(HR can't be assigned anything but Saturday) or an invalid gender or department(
	HR can't be assigned a department). otherwise, Staff will be added and their id will be automatically generated.

14- Functionality: Updates a staff on the System
	Route: /staff/Updatetaff
	Request type: PUT
	Request body: {"id":"hr-1","name":"Ali Othman","email":"ali.saad@student.guc.edu.eg","officelocation":"C5-105","role":"","dayoff":"","department":""}
	Parameters: if is for the staff to be updated, everything else (name,email,officelocation,role,dayoff,department) can be changed as long as they are valid values
	and dont conflict with the rule or current location of the staff.dayoff can't be changed for an HR member and they don't belong to a department, role can be changed to
	"HR","lecturer","TA".
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of an id that doesn't exist or an officelocation with full apacity or doesnt exist.otherwise, staff will be Updated.

15-	Functionality: Deletes a staff From the System
	Route: /staff/DeleteStaff
	Request type: DELETE
	Request body: {"id":"hr-1"}
	Response: a message requesting the entery of valid input in case of any invalid inputs
	or entery of a staff member that doesn't exist that doesnt exist. otherwise, staff will be Deleted.

16-	Functionality: Updates a staff's salary on the System
	Route: /staff/UpdateSalary
	Request type: PUT
	Request body: {"id":"hr-1","promotion":500}
	Parameters: id is the id of the staff whose salary needs to be updated and promotion is a raw number which is added to the salary
	in case of any kind of raise.
	Response: a message requesting the entery of valid input in case of any invalid input or entery of negative promotion.otherwise,
	staff's salary will be Updated according to missed days and hours and minutes.

17-	Functionality: Adds a sign in record for a staff on the System
	Route: /staff/AddsignIn
	Request type: POST
	Request body: {"id":"hr-1","date":"12/25/2020","Time":"10:30"}
	Response: a message requesting the entery of valid input in case of any invalid inputs or broken constraints(Example:signing in before 7AM or after 7PM)
	otherwise, the sign in record will be added.

18-	Functionality: Adds a sign out record for a staff on the System
	Route: /staff/signOut
	Request type: POST
	Request body: {"id":"hr-1","date":"12/25/2020","Time":"10:30"}
	Response: a message requesting the entery of valid input in case of any invalid inputs or broken constraints(signing out before 7AM or after 7PM)
	or having no sign in record before signing out. otherwise, the sign out record will be added.

19-	Functionality: Views the attendance record for a staff member
	Route: /staff/viewStaffAttendance
	Request type: GET
	Request body: {"id":"hr-1"}
	Response: an array of attendance for the given staff, 
{
    "missedDays": 0,
    "missedHours": 8,
    "_id": "5fe5b2b0e61abb2180e42974",
    "id": "ac-0",
    "month": "11",
    "days": [
        {
            "signIn": [
                "2020-12-09T05:00:00.000Z"
            ],
            "signOut": ["2020-12-09T10:00:00.000Z"],
            "_id": "5fe5b2b0e61abb2180e42975",
            "id": "ac-0",
            "date": "12/9/2020,",
            "day": "Wed",
            "month": "12",
            "__v": 0
        }
    ],
    "__v": 0
}

20-	Functionality: Views all staff members with missed days or hours
	Route: /staff/Viewmissed
	Request type: GET
	Response: an array of all staff with missed days or hours, 
[
    {
        "leaveBalance": 2.5,
        "course": [
            "CSEN720"
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxYTk0NTQyOTY3MTA2ZjRlNmQ0ZTciLCJyb2xlIjoibGVjdHVyZXIiLCJpYXQiOjE2MDg5MTIxMjR9.BVuay2SA62Tx7crWnt3unvM2wOZsFSEtWa1R9xVOpz4",
        "_id": "5fe1a94542967106f4e6d4e7",
        "id": "ac-0",
        "name": "Selim Elbindary",
        "email": "selim.elbindary@guc.edu.eg",
        "password": "$2b$10$C9l/2TMyxWiqtH8iiNb3lOB3apM0ytPoYIjLd7htf6A0grc8U1PEy",
        "role": "lecturer",
        "salary": 100,
		"lastSalary": 80,
        "dayOff": "Mon",
        "officeLocation": "",
        "department": "MET",
		"gender" : "M",
        "createdAt": "2020-12-22T08:07:33.700Z",
        "updatedAt": "2020-12-25T16:02:04.858Z",
        "__v": 29
    }
]
		
---------------------------------------------------------------------------------------------------------------------------------------------------	
		
		
		
		
		
		
		
		
		

