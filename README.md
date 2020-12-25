# ACL
**Some of these tables were change on the latest merge to main**

**2 GUC staff member functionalities**<br>
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
[
    {
        "signIn": [
            "2020-12-09T05:00:00.000Z"
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
