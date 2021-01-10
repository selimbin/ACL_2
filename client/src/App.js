import React, { Component } from 'react'
import Navbar from "./components/Navbar/Navbar";
import axios from 'axios';
import {BrowserRouter as Router,Link,Route} from 'react-router-dom'
import './App.css';
// Images ----------------------
// import viewprofile from './Images/View_Profile.png';
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
import Login from './Login';

export class App extends Component {
  render() {
    return (
      <Router> 
      <Route path ="/Home">
        <div class="App">
          <Navbar/>
        </div>
        {/* <div Class="flexContainer">
          <div class="container">
            <a href = "Ops">
              <img Class="Images" src= {viewprofile} alt= 'View profile icon' />
              <div class="overlay">
                  <div class="text">View Profile</div>
              </div>
            </a>
          </div> 
          <div class="container2">
            <a href = "Ops">
              <img Class="Images" src= {viewprofile} alt= 'View profile icon' />
              <div class="overlay">
                  <div class="text">View Profile</div>
              </div>
            </a>
          </div> 
        </div> */}
      </Route>
      <Route exact path ="/addstaff" component = {AddStaff}>
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
      <Route  exact path="/login" component={Login} />
      </Router>
    )
  }
}

export default App;
