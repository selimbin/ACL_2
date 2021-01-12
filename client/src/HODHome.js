import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar/HODNavbar";
import viewprofile from './components/Images/View_Profile.png';
import signin from './components/Images/SignIn.jpg';
import signout from './components/Images/SignOut.jpg';
import './HrHome.css'

export class HrHome extends Component {
    render() {
        return (
            <div class="home">
                <Navbar/>
                <div Class="flex-container1">
                    <div Class="viewprofile">
                    <a href="viewprofile">
                        <img Class="viewprofile" src={viewprofile} alt="profile"/>
                    </a>
                    <a href="viewprofile" Class="text1">View Profile</a>
                    </div>
                    <div Class="viewattendance">
                    <a href="viewattendance">
                        <img Class="viewattendance" src={viewprofile}/>
                    </a>
                    <a href="viewattendance" Class="text2">View Attendance</a>
                    </div>
                    <div Class="viewmissingdayshours">
                    <a href="viewmissingdayshours">
                        <img Class="viewmissingdayshours" src={viewprofile}/>
                    </a>
                    <a href="viewmissingdayshours" Class="text3">View Missing days/hours</a>
                    </div>
                </div>
                <div Class="flex-container2">
                <div Class="signin">
                    <a>
                        <img Class="signin" src={signin}/>
                    </a>
                    <a Class="text4">SignIn</a>
                    </div>
                    <div Class="signout">
                    <a>
                        <img Class="signout" src={signout}/>
                    </a>
                    <a Class="text5">SignOut</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default HrHome