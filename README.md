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