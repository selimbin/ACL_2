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


