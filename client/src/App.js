import React, { Component } from 'react'
import Navbar from "./components/Navbar/Navbar";
import axios from 'axios';
import {BrowserRouter as Router,Link,Route} from 'react-router-dom'
import './App.css';
// Images ------------
// import viewprofile from './Images/View_Profile.png';
// Routes ------------
import AddStaff from './HRLayout/Add/AddStaff'
import AddDepartment from './HRLayout/Add/AddDepartment'
import AddFaculty from './HRLayout/Add/AddFaculty'
import AddCourse from './HRLayout/Add/AddCourse'
import AddLocation from './HRLayout/Add/AddLocation'
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
      <Route  exact path="/login" component={Login} />
      </Router>
    )
  }
}

export default App;
