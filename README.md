
# ACL
**Some of these tables were change on the latest merge to main**

**2 GUC staff member functionalities**<br>

PORT = 3000

*Any staff member functionalities*<br>

Functionality: Log In<br>
Route: /login<br>
Request type: POST<br>
Request body: { “email”:“selim.elbindary@guc.edu.eg”, “password”: “123456”}<br>
Response if not registered : "You need to sign up first or incorrect email"<br>
Response if incorrect email or password: "Incorrect Password"<br>

Functionality: Log Out<br>
Route: /staff/logout<br>
Request type: POST<br>
Response:"logged out"<br>

Functionality: User views his/her profile<br>
Route: /staff/viewProfile<br>
Request type: GET<br>
Response: User Profile, ex:<br>
{<br>
    "leaveBalance": 2.5,<br>
    "course": [<br>
        "CSEN720"<br>
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxYTk0NTQyOTY3MTA2ZjRlNmQ0ZTciLCJyb2xlIjoibGVjdHVyZXIiLCJpYXQiOjE2MDg5MTIxMjR9.BVuay2SA62Tx7crWnt3unvM2wOZsFSEtWa1R9xVOpz4",
    "_id": "5fe1a94542967106f4e6d4e7",
    "id": "ac-0",
    "name": "Selim Elbindary",
    "email": "selim.elbindary@guc.edu.eg",
    "password": "$2b$10$C9l/2TMyxWiqtH8iiNb3lOB3apM0ytPoYIjLd7htf6A0grc8U1PEy",
    "role": "lecturer",
    "salary": 100,
    "dayOff": "Mon",
    "officeLocation": "C5-720",
    "misseddays": 0,
    "missedHours": 0,
    "department": "MET",
    "createdAt": "2020-12-22T08:07:33.700Z",
    "updatedAt": "2020-12-25T16:02:04.858Z",
    "__v": 29
}

Functionality: User updates their profile<br>
Route: /staff/updateProfile<br>
Request type: PUT<br>
Request body: { “email”:“selim.elbindary@guc.edu.eg”, “oldPassword”: “123456”,"newPassword":"pass",}<br>
Response if wrong old password: "wrong insertion"<br>

Functionality: User resets his/her password<br>
Route: /staff/resetPassword<br>
Request type: PUT<br>
Request body: {“email”:“selim.elbindary@guc.edu.eg”, “oldPassword”: “123456”,"newPassword":"pass"}<br>
Response if wrong: "wrong insertion"<br>

Functionality: User signs in<br>
Route: /staff/signIn<br>
Request type: POST<br>
Response if after 7PM : "You cannot sign in after 7PM"<br>

Functionality: User signs out<br>
Route: /staff/signOut<br>
Request type: POST<br>
Response if after 7PM : "You cannot sign in after 7PM"<br>

Functionality: User resets his/her password<br>
Route: /staff/resetPassword<br>
Request type: PUT<br>
Request body: {“oldPassword”: “123456”,"newPassword":"pass"}<br>
Response if wrong: "wrong insertion"<br>

Functionality: User views all his/her attendance or for a specific month <br>
Route: /staff/viewAttendance<br>
Request type: GET<br>
Request body for all atendances: {}<br>
Request body for atendances in a specific month: {month:"12"}<br>
response: attendance sheet of specific month, ex:<br>
[<br>
    {<br>
        "signIn": [<br>
            "2020-12-09T05:00:00.000Z"<br>
        ],
        "signOut": [],
        "_id": "5fe5b2b0e61abb2180e42975",
        "id": "ac-0",
        "date": "12/9/2020",
        "day": "Wed",
        "month": "12",
        "__v": 0
    },
    {
        "signIn": [
            "2020-12-25T19:12:28.731Z"
        ],
        "signOut": [
            "2020-12-25T17:00:53.723Z"
        ],
        "_id": "5fe5b320bd8e7021b4e95994",
        "id": "ac-0",
        "date": "12/25/2020",
        "day": "Fri",
        "month": "12",
        "__v": 0
    }
]

Functionality: User views if they have missing days<br>
Route: /staff/viewMissingDays<br>
Request type: GET<br>
Response if not any schedule yet created for this month: "You're missing days have not yet been calculated this month"<br>
Response: 3

Functionality: User views if they have missing days<br>
Route: /staff/viewMissingHours<br>
Request type: GET<br>
Response if not any schedule yet created for this month: "You're missing hours have not yet been calculated this month"<br>
Response: 2.1930577777777778


=======


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

**4 Academic member functionalities**<br>
*4.1 HOD functionalities*<br>

Functionality: Assign an instructor to teach a course<br>
Route: /staff/assignInstructor<br>
Request type: POST<br>
Request body: { “id”:“ac-3”, “course”: “CSEN720”}<br>
Response if not HOD: "You are not authorized to access this page"<br>

Functionality: Delete an instructor from a course
Route: /staff/removeInstructor
Request type: POST
Request body: { “id”:“ac-3”, “course”: “CSEN720”}
Response if not HOD: "You are not authorized to access this page"

Functionality: Update an instructor who teaches a course with another instructor
Route: /staff/updateInstructor
Request type: PUT
Request body: { “newID”:“ac-3”,"oldID":"ac-0", “course”: “CSEN720”}
Response if not HOD: "You are not authorized to access this page"

Functionality: HOD views all staff in his/her department
Route: /staff/viewStaff
Request type: GET
Request body to view all staff: { "view":"department"}
Request body to view all staff in a course: {"view":"course","course":"CSEN720"}
Response if not HOD: "You are not authorized to access this page"
Response: List of staff who are in the concerned department/course

Functionality: View dayOff of an instructor in his/her department or all instructors
Route: /staff/viewDayOff
Request type: GET
Request body to view all staffs dayOff: {}
Request body to view a staff members dayOff: {"id":"ac-3"}
Response if not HOD: "You are not authorized to access this page"
Response: List of name, id and dayOff of concerned staff members or dayOff if only one staff member


Functionality: View Change dayOff/leave request of an instructor in his/her department or all instructors
Route: /staff/viewChangeDayOff
Request type: GET
Response if not HOD: "You are not authorized to access this page"
Response: List of all change day off request in HOD department ex:
    {
        "status": "accepted",
        "_id": "5fe6087eb26be643d4c633fb",
        "type": "changedayoffRequest",
        "reason": "Really bro u need a reason ok then extra long weekend",
        "requester": "ac-1",
        "receiver": "ac-0",
        "newDay": "Mon",
        "__v": 0
    },
    {
        "status": "rejected",
        "_id": "5fe6096fb26be643d4c633fc",
        "type": "changedayoffRequest",
        "reason": "Really bro u need a reason ok then extra long weekend",
        "requester": "ac-1",
        "receiver": "ac-0",
        "newDay": "Mon",
        "__v": 0,
        "response": "Really tony you want ANOTHER leave day, i just accepted like 4 of them"
    }

Functionality: Accept a request of an instructor in his/her department or all instructors
Route: /staff/acceptRequest
Request type: POST
Request body: {"_id":"5fe6087eb26be643d4c633fb"}
Response if not HOD: "You are not authorized to access this page"

Functionality: Accept a request of an instructor in his/her department or all instructors
Route: /staff/acceptRequest
Request type: POST
Request body: {"_id":"5fe6087eb26be643d4c633fb"}
Response if incorrect _id:"No corresponding request"
Response if not HOD: "You are not authorized to access this page"

Functionality: View dayOff of an instructor in his/her department or all instructors
Route: /staff/rejectRequest
Request type: POST
Request body to reject request: {"_id":"5fe6087eb26be643d4c633fb"}
Request body to reject request and leave a response: {"_id":"5fe6087eb26be643d4c633fb","response":"Response here"}
Response if incorrect _id:"No corresponding request"
Response if not HOD: "You are not authorized to access this page"

Functionality: View coverage of each course in his/her department
Route: /staff/viewCoverage
Request type: GET
Response if not HOD: "You are not authorized to access this page"
Response: Course Coverag, Code and _id , ex: 
    {
        "coverage": 0,
        "_id": "5fe6171fcb5ea0187ca69f11",
        "code": "CSEN703"
    }

Functionality: View assignments of a course in his/her department
Route: /staff/viewAssignments
Request type: GET
Request body to reject request: {"course":"CSEN720"}
Response: course schedule
Response if not HOD: "You are not authorized to access this page"


	--All academic staff routes:--
  
Functionality: views staff schedules usinhg their ids
Route: /staff/viewschedule
Request type: GET
Parameters: takes a staff id 
Response: Array of days that have slots in them . Example of a single day: {saturday{slot 1 ,slot 2,slot 3,slot 4,slot 5},......} 

Functionality: send a replacement request to a fellow TA in the same course
Route: /staff/sendReplacmentReq
Request type: POST
Parameters: takes a staff id 
Request body: { “course” : “csen1”, reason:"can be emphty" }
Response: shows you the new reqest made example {type:'ReplacmentReq',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty"}


Functionality: views all replacement requests 
Route: /staff/viewReplacementReq
Request type: GET
Parameters: takes a staff id 
Response: shows you all replacments requests example {type:'ReplacmentReq',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty"}

Functionality: send a slot linking request request to the course cordinator of the same course
Route: /staff/slotlinkingrequest
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can be emphty" }
Response: shows you the new reqest made example {type:'slotlinkingrequest',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty"}

Functionality: send a slot linking request request to the course cordinator of the same course
Route: /staff/changeDayOffReq
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can be emphty",newDay:"thu"}newDay needs to be three letter acrenum of the day otherwise will not be accepted
Response: shows you the new reqest made example {type:'changeDayOffReq',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty",newDay:"thu"}

Functionality: send a  Annual Leave request request to the head of my department
Route: /staff/AnnualLeaveReq
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can be emphty",date:"2020-12-28",amount:5}
Response: shows you the new reqest made example -{type:'AnnualLeave',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty",date:"2020-12-28",amount:5}


Functionality: send a  Compensation Leave request request to the head of my department
Route: /staff/CompensationLeaveReq
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can not be emphty",amount:5}
Response: shows you the new reqest made example -{type:'CompensationLeave',requester:'40-55555555',reciever:'43-6969696969',reason:"can not be emphty",amount:5}

Functionality: send a  Maternity Leave request request to the head of my department
Route: /staff/MaternityLeaveReq
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can  be emphty",amount:5}
Response: shows you the new reqest made example -{type:'MaternityLeave',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty",amount:5}

Functionality: send a  accidental Leave request request to the head of my department
Route: /staff/accidentalLeaveReq
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can  be emphty",amount:5 }amount cant be more than 6 days
Response: shows you the new reqest made example -{type:'accidentalLeave',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty",amount:5}

Functionality: send a  sick Leave request request to the head of my department
Route: /staff/sickleaveReq
Request type: POST
Parameters: takes a staff id 
Request body: { reason:"can  be emphty",amount:5 }
Response: shows you the new reqest made example -{type:'sickleaveReq',requester:'40-55555555',reciever:'43-6969696969',reason:"can be emphty",amount:5}

Functionality: send a  notification
Route: /staff/Notification
Request type: GET
Parameters: takes a staff id 
Response: shows you all the requests all not pending example -{"requests that have been approved or denied",request 1, .......}

Functionality: views all his Accepted Requests
Route: /staff/viewAcceptedRequests
Request type: GET
Parameters: takes a staff id 
Response: shows you all the requests all Accepted example -{request 1, .......}

Functionality: views all his rejected Requests
Route: /staff/viewRejectedRequests
Request type: GET
Parameters: takes a staff id 
Response: shows you all the requests all rejected example -{request 1, .......}

Functionality: views all his Pending Requests
Route: /staff/viewPendingRequests
Request type: GET
Parameters: takes a staff id 
Response: shows you all the requests all Pending example -{request 1, .......}

Functionality: cancels one of his requests by checking all his requests using request id
Route: /staff/cancelRequests
Request type: POST
Parameters: takes a staff id
Request body: { id:789389io23hjkfjk}
Response:  "Request Canceled"
