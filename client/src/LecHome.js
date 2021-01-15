import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./components/Navbar/LecNavbar";
import viewprofile from './components/Images/View_Profile.jpeg';
import signin from './components/Images/SignIn.jpg';
import signout from './components/Images/SignOut.jpeg';
import viewschedule from './components/Images/ViewSchedule.jpeg';
import viewattendance from './components/Images/ViewAttendance.jpeg';
import viewmissing from './components/Images/ViewMissing.jpg';
import './LecHome.css'

export class LecHome extends Component {

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
                    <div Class="viewprofilelec">
                    <a href="viewprofile">
                        <img Class="viewprofilelec" src={viewprofile} alt="profile"/>
                    </a>
                    </div>
                    <div Class="viewattendancelec">
                    <a href="viewattendance">
                        <img Class="viewattendancelec" src={viewattendance}/>
                    </a>
                    </div>
                    <div Class="viewmissingdayshourslec">
                    <a href="viewmissingdayshours">
                        <img Class="viewmissingdayshourslec" src={viewmissing}/>
                    </a>
                    </div>
                    <div Class="viewschedulelec">
                    <a href="viewschedule">
                        <img Class="viewschedulelec" src={viewschedule}/>
                    </a>
                </div>
                </div>
                <div Class="flex-container2">
                <ToastContainer />
                <button Class="signinlec" onClick={this.onClicksignin}>
                        <img Class="signinlecimg" src={signin}/>
                </button>
                <button Class="signoutlec" onClick={this.onClicksignout}>
                        <img Class="signoutlecimg" src={signout}/>
                </button>
                </div>
            </div>
        )
    }
}

export default LecHome