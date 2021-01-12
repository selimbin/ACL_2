
import React, { Component, useState } from 'react'
import Navbar from "./components/Navbar/Navbar";
import axios from 'axios';
import {BrowserRouter as Router,Link,Route,Switch} from 'react-router-dom'

import './App.css';
// Images ----------------------
// Add Routes ------------------
import AddStaff from './HRLayout/Add/AddStaff'
import Addslot from './CCLayout/Add/Addslot'
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
import Removemem from './CILayout/Delete/Removemem'
import DeleteDepartment from './HRLayout/Delete/DeleteDepartment'
import DeleteFaculty from './HRLayout/Delete/DeleteFaculty'
import DeleteCourse from './HRLayout/Delete/DeleteCourse'
import DeleteLocation from './HRLayout/Delete/DeleteLocation'
// View Routes ------------------
import ViewMissing from './HRLayout/View/ViewMissing'
import ViewStaffAttendance from './HRLayout/View/ViewStaffAttendance'
// Services Routes --------------
import ViewProfile from './GeneralLayout/ViewProfile'
import ViewAttendance from './GeneralLayout/ViewAttendance'
import ViewMissingDaysHours from './GeneralLayout/ViewMissingDaysHours'
import ResetPassword from './GeneralLayout/ResetPassword'
import UpdateProfile from './GeneralLayout/UpdateProfile'
import Login from './Login';
import useToken from './components/useToken';
// Home Routes ------------------
import HrHome from './HrHome'
import HodHome from './HODHome'
import CCHome from './CCHome'


// export class App extends Component {
//   render() {
//     return (
      // <Router> 
      // <Route path ="/">
      //   <div class="App">
      //   </div>
      // </Route>
      // <Route exact path ="/addstaff" component = {AddStaff}>
      // </Route>
      // <Route exact path ="/adddepartment" component = {AddDepartment}>
      // </Route>
      // <Route exact path ="/addfaculty" component = {AddFaculty}>
      // </Route>
      // <Route exact path ="/addcourse" component = {AddCourse}>
      // </Route>
      // <Route exact path ="/addlocation" component = {AddLocation}>
      // </Route>
      // <Route exact path ="/addsigninout" component = {AddSignInOut}>
      // </Route>
      // <Route exact path ="/updatestaff" component = {UpdateStaff}>
      // </Route>
      // <Route exact path ="/updatedepartment" component = {UpdateDepartment}>
      // </Route>
      // <Route exact path ="/updatefaculty" component = {UpdateFaculty}>
      // </Route>
      // <Route exact path ="/updatecourse" component = {UpdateCourse}>
      // </Route>
      // <Route exact path ="/updatelocation" component = {UpdateLocation}>
      // </Route>
      // <Route exact path ="/updatesalary" component = {UpdateSalary}>
      // </Route>
      // <Route exact path ="/deletestaff" component = {DeleteStaff}>
      // </Route>
      // <Route exact path ="/deletedepartment" component = {DeleteDepartment}>
      // </Route>
      // <Route exact path ="/deletefaculty" component = {DeleteFaculty}>
      // </Route>
      // <Route exact path ="/deletecourse" component = {DeleteCourse}>
      // </Route>
      // <Route exact path ="/deletelocation" component = {DeleteLocation}>
      // </Route>
      // <Route exact path ="/viewmissing" component = {ViewMissing}>
      // </Route>
      // <Route exact path ="/viewstaffattendance" component = {ViewStaffAttendance}>
      // </Route>
      // <Route exact path ="/viewprofile" component = {ViewProfile}>
      // </Route>
      // <Route exact path ="/viewattendance" component = {ViewAttendance}>
      // </Route>
      // <Route exact path ="/viewmissingdayshours" component = {ViewMissingDaysHours}>
      // </Route>     
      // <Route  exact path="/login" component={Login}>
      // </Route>
      // <Route  exact path="/HrHome" component={HrHome}>
      // </Route>
      // <Route  exact path="/HodHome" component={HodHome}>
      // </Route>
      // <Route  exact path="/CCHome" component={CCHome}>
      // </Route>
      // <Route  exact path="/resetpassword" component={ResetPassword}>
      // </Route>
      // <Route  exact path="/updateprofile" component={UpdateProfile}>
      // </Route>
      // </Router>
//     )
//   }
function App() {
  // localStorage.setItem('token',"")
  // const { token1, setToken } = useToken();
  // alert(sessionStorage.getItem('token'))
 /* var token = null
  token = sessionStorage.getItem("token");
  if(token==null) {
    return <Login />
  }*/
    return (
      <div className="wrapper">
      <Router>
        <Switch>
         <Route path ="/HrHome" component={HrHome}>
           <div class="App">
            <Navbar/>
           </div>
         </Route>
          <Route exact path ="/addstaff" component = {AddStaff}>
          </Route>
          <Route exact path ="/addslotCC" component = {Addslot}>
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
          <Route exact path ="/removememCI" component = {Removemem}>
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
          <Route exact path ="/viewattendance" component = {ViewAttendance}>
          </Route>
          <Route exact path ="/viewmissingdayshours" component = {ViewMissingDaysHours}>
          </Route>   
          <Route  exact path="/HodHome" component={HodHome}>
          </Route>
          <Route  exact path="/CCHome" component={CCHome}>
          </Route>
          <Route  exact path="/resetpassword" component={ResetPassword}>
          </Route>
          <Route  exact path="/updateprofile" component={UpdateProfile}>
          </Route>
        </Switch>
        
      </Router>
      </div>
    );
  // }
}

export default App;
