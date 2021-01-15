
import React, { Component, useState } from 'react'
import Navbar from "./components/Navbar/Navbar";
import axios from 'axios';
import {BrowserRouter as Router,Link,Route,Switch} from 'react-router-dom'

import './App.css';
// Images ----------------------
// Add Routes ------------------
import AddStaff from './HRLayout/Add/AddStaff'
import AddDepartment from './HRLayout/Add/AddDepartment'
import AddFaculty from './HRLayout/Add/AddFaculty'
import AddCourse from './HRLayout/Add/AddCourse'
import AddLocation from './HRLayout/Add/AddLocation'
import AddSignInOut from './HRLayout/Add/AddSignInOut'
// Update Routes ---------------
import UpdateStaff from './HRLayout/Update/UpdateStaff'
import UpdateDepartment from './HRLayout/Update/UpdateDepartment'
import UpdateFaculty from './HRLayout/Update/UpdateFaculty'
import UpdateCourse from './HRLayout/Update/UpdateCourse'
import UpdateLocation from './HRLayout/Update/UpdateLocation'
import UpdateSalary from './HRLayout/Update/UpdateSalary'
// Delete Routes ---------------
import DeleteStaff from './HRLayout/Delete/DeleteStaff'
import DeleteDepartment from './HRLayout/Delete/DeleteDepartment'
import DeleteFaculty from './HRLayout/Delete/DeleteFaculty'
import DeleteCourse from './HRLayout/Delete/DeleteCourse'
import DeleteLocation from './HRLayout/Delete/DeleteLocation'
// View Routes ------------------
import ViewMissing from './HRLayout/View/ViewMissing'
import ViewStaffAttendance from './HRLayout/View/ViewStaffAttendance'
// Services Routes --------------
import ViewProfile from './GeneralLayout/ViewProfile'
import ViewSchedule from './GeneralLayout/ViewSchedule'
import ViewAttendance from './GeneralLayout/ViewAttendance'
import ViewMissingDaysHours from './GeneralLayout/ViewMissingDaysHours'
import ResetPassword from './GeneralLayout/ResetPassword'
import UpdateProfile from './GeneralLayout/UpdateProfile'
import Login from './Login';
// Home Routes ------------------
import Home from './Home'
//HOD Manage Department Routes
import AssignStaffCourse from './HODLayout/ManageDepartment/AssignStaffCourse'
import DeleteStaffCourse from './HODLayout/ManageDepartment/DeleteStaffCourse'
import UpdateStaffCourse from './HODLayout/ManageDepartment/UpdateStaffCourse'
import ViewDepartmentStaff from './HODLayout/ManageDepartment/ViewDepartmentStaff'
import ViewCourseCoverageHOD from './HODLayout/ManageDepartment/ViewCourseCoverageHOD'
import ViewDayOffStaff from './HODLayout/ManageDepartment/ViewDayOffStaff'
import ViewDepTeachAssign from './HODLayout/ManageDepartment/ViewDepTeachAssign'
import AcceptRequests from './HODLayout/ManageRequests/AcceptRequests'
import RejectRequests from './HODLayout/ManageRequests/RejectRequests'
import ViewDayOffRequests from './HODLayout/ManageRequests/ViewDayOffRequests'
//Lec ManageCourses Routes
import AssignMemberAsCC from './LecturerLayout/ManageCourses/AssignMemberAsCC'
import AssignMemberToCourse from './LecturerLayout/ManageCourses/AssignMemberToCourse'
import DeleteCourseAssignment from './LecturerLayout/ManageCourses/DeleteCourseAssignment'
import RemoveMemberFromCourse from './LecturerLayout/ManageCourses/RemoveMemberFromCourse'
import UpdateCourseAssignment from './LecturerLayout/ManageCourses/UpdateCourseAssignment'
import ViewAllDepStaff from './LecturerLayout/ManageCourses/ViewAllDepStaff'
import ViewCourseCoverageLec from './LecturerLayout/ManageCourses/ViewCourseCoverageLec'
import ViewCourseSlotAssignment from './LecturerLayout/ManageCourses/ViewCourseSlotAssignment'
//Course Coordinator Routes
import AcceptSlotLinking from './CourseCoordinatorLayout/AcceptSlotLinking'
import AddCourseSlot from './CourseCoordinatorLayout/AddCourseSlot'
import DeleteCourseSlot from './CourseCoordinatorLayout/DeleteCourseSlot'
import RejectSlotLinking from './CourseCoordinatorLayout/RejectSlotLinking'
import UpdateCourseSlot from './CourseCoordinatorLayout/UpdateCourseSlot'
import ViewSlotLinkingRequests from './CourseCoordinatorLayout/ViewSlotLinkingRequests'
//Academic Staff Routes
import CancelRequests from './Requests/CancelRequest'
import ChangeDayOffRequest from './Requests/ChangeDayOffRequest'
import SendReplacementRequest from './Requests/SendReplacementRequest'
import SendSlotLinkingRequest from './Requests/SendSlotLinkingRequest'
import ViewReplacementRequest from './Requests/ViewReplacementRequest'
import ViewRequestStatus from './Requests/ViewRequestStatus'
import SubmitLeaveRequest from './Requests/SubmitLeaveRequest'


function App() {
  var token = null
  token = sessionStorage.getItem("token");
  if(token==null) {
    return <Login />
  }
    return (
      <div className="wrapper">
      <Router>
        <Switch>
         <Route path ="/Home">
           <Home />
         </Route>
          <Route exact path ="/addstaff" component = {AddStaff}>
          </Route>
          <Route exact path ="/Login" component = {Login}>
          </Route>
          <Route exact path ="/adddepartment" component = {AddDepartment}>
          </Route>
          <Route exact path ="/addfaculty" component = {AddFaculty}>
          </Route>
          <Route exact path ="/addcourse" component = {AddCourse}>
          </Route>
          <Route exact path ="/addlocation" component = {AddLocation}>
          </Route>
          <Route exact path ="/addsigninout" component = {AddSignInOut}>
          </Route>
          <Route exact path ="/updatestaff" component = {UpdateStaff}>
          </Route>
          <Route exact path ="/updatedepartment" component = {UpdateDepartment}>
          </Route>
          <Route exact path ="/updatefaculty" component = {UpdateFaculty}>
          </Route>
          <Route exact path ="/updatecourse" component = {UpdateCourse}>
          </Route>
          <Route exact path ="/updatelocation" component = {UpdateLocation}>
          </Route>
          <Route exact path ="/updatesalary" component = {UpdateSalary}>
          </Route>
          <Route exact path ="/deletestaff" component = {DeleteStaff}>
          </Route>
          <Route exact path ="/deletedepartment" component = {DeleteDepartment}>
          </Route>
          <Route exact path ="/deletefaculty" component = {DeleteFaculty}>
          </Route>
          <Route exact path ="/deletecourse" component = {DeleteCourse}>
          </Route>
          <Route exact path ="/deletelocation" component = {DeleteLocation}>
          </Route>
          <Route exact path ="/viewmissing" component = {ViewMissing}>
          </Route>
          <Route exact path ="/viewstaffattendance" component = {ViewStaffAttendance}>
          </Route>
          <Route exact path ="/viewprofile" component = {ViewProfile}>
          </Route>
          <Route exact path ="/viewschedule" component = {ViewSchedule}>
          </Route>
          <Route exact path ="/viewattendance" component = {ViewAttendance}>
          </Route>
          <Route exact path ="/viewmissingdayshours" component = {ViewMissingDaysHours}>
          </Route>   
          <Route  exact path="/resetpassword" component={ResetPassword}>
          </Route>
          <Route  exact path="/updateprofile" component={UpdateProfile}>
          </Route>

          <Route exact path ="/assignStaff" component = {AssignStaffCourse}>
          </Route>
          <Route exact path ="/removeStaffHOD" component = {DeleteStaffCourse}>
          </Route>
          <Route exact path ="/updateStaffHOD" component = {UpdateStaffCourse}>
          </Route>
          <Route exact path ="/viewDepStaff" component = {ViewDepartmentStaff}>
          </Route>
          <Route exact path ="/viewStaffDayOffHOD" component = {ViewDayOffStaff}>
          </Route>
          <Route exact path ="/viewCourseCoverage" component = {ViewCourseCoverageHOD}>
          </Route>
          <Route exact path ="/viewTeachingAssignments" component = {ViewDepTeachAssign}>
          </Route>
          <Route exact path ="/acceptHODRequests" component = {AcceptRequests}>
          </Route>
          <Route exact path ="/rejectHODRequests" component = {RejectRequests}>
          </Route>
          <Route exact path ="/viewDayOffReqHOD" component = {ViewDayOffRequests}>
          </Route>
          

          <Route exact path ="/assignMemberCourseCoordinator" component = {AssignMemberAsCC}>
          </Route>
          <Route exact path ="/assignAcadCourse" component = {AssignMemberToCourse}>
          </Route>
          <Route exact path ="/deleteCourseAssignment" component = {DeleteCourseAssignment}>
          </Route>
          <Route exact path ="/removeMemberCourse" component = {RemoveMemberFromCourse}>
          </Route>
          <Route exact path ="/updateCourseAssignment" component = {UpdateCourseAssignment}>
          </Route>
          <Route exact path ="/viewTeachingAssignments" component = {ViewAllDepStaff}>
          </Route>
          <Route exact path ="/viewMyCoverage" component = {ViewCourseCoverageLec}>
          </Route>
          <Route exact path ="/viewCourseSlotAssignment" component = {ViewCourseSlotAssignment}>
          </Route>



          <Route exact path ="/acceptSlotLinkingRequest" component = {AcceptSlotLinking}>
          </Route>
          <Route exact path ="/addCourseSlot" component = {AddCourseSlot}>
          </Route>
          <Route exact path ="/deleteCourseSlot" component = {DeleteCourseSlot}>
          </Route>
          <Route exact path ="/rejectSlotLinkingRequest" component = {RejectSlotLinking}>
          </Route>
          <Route exact path ="/updateCourseSlot" component = {UpdateCourseSlot}>
          </Route>
          <Route exact path ="/viewSlotLinkingRequestsCC" component = {ViewSlotLinkingRequests}>
          </Route>


          <Route exact path ="/cancelRequest" component = {CancelRequests}>
          </Route>
          <Route exact path ="/changeDayOffReq" component = {ChangeDayOffRequest}>
          </Route>
          <Route exact path ="/sendReplacementRequest" component = {SendReplacementRequest}>
          </Route>
          <Route exact path ="/sendSlotLinkingReq" component = {SendSlotLinkingRequest}>
          </Route>
          <Route exact path ="/submitLeaveRequest" component = {SubmitLeaveRequest}>
          </Route>
          <Route exact path ="/viewReplacementRequest" component = {ViewReplacementRequest}>
          </Route>
          <Route exact path ="/viewRequestStatus" component = {ViewRequestStatus}>
          </Route>


        </Switch>
        
      </Router>
      </div>
    );
}

export default App;
