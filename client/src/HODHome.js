import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar/HODNavbar";
import viewprofile from './components/Images/View_Profile.jpeg';
import signin from './components/Images/SignIn.jpg';
import signout from './components/Images/SignOut.jpeg';
import viewschedule from './components/Images/ViewSchedule.jpeg';
import viewattendance from './components/Images/ViewAttendance.jpeg';
import viewmissing from './components/Images/ViewMissing.jpg';
import './HODHome.css'

export class HODHome extends Component {

    onClicksignin = () => {
        axios.post("http://localhost:5000/staff/signIn", {},{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })        
        .then((res) => toast.success("Signed In successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    } 

    onClicksignout = () =>{
        axios.post("http://localhost:5000/staff/signOut", {},{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Signed Out successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }

    render() {
        return (
            <div class="home">
                <div Class="flex-container1">
                    <div Class="viewprofilehod">
                    <a href="viewprofile">
                        <img Class="viewprofilehod" src={viewprofile} alt="profile"/>
                    </a>
                    </div>
                    <div Class="viewattendancehod">
                    <a href="viewattendance">
                        <img Class="viewattendancehod" src={viewattendance}/>
                    </a>
                    </div>
                    <div Class="viewmissingdayshourshod">
                    <a href="viewmissingdayshours">
                        <img Class="viewmissingdayshourshod" src={viewmissing}/>
                    </a>
                    </div>
                    <div Class="viewschedulehod">
                    <a href="viewschedule">
                        <img Class="viewschedulehod" src={viewschedule}/>
                    </a>
                </div>
                </div>
                <div Class="flex-container2">
                <button Class="signinhod" onClick={this.onClicksignin}>
                <ToastContainer />
                        <img Class="signinhodimg" src={signin}/>
                </button>
                <button Class="signouthod" onClick={this.onClicksignout}>
                <ToastContainer />
                        <img Class="signouthodimg" src={signout}/>
                </button>
                </div>
            </div>
        )
    }
}

export default HODHome