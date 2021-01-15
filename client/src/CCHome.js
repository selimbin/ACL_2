import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import viewprofile from './components/Images/View_Profile.jpeg';
import signin from './components/Images/SignIn.jpg';
import signout from './components/Images/SignOut.jpeg';
import viewschedule from './components/Images/ViewSchedule.jpeg';
import viewattendance from './components/Images/ViewAttendance.jpeg';
import viewmissing from './components/Images/ViewMissing.jpg';
import './CCHome.css'

export class CCHome extends Component {

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
                    <div Class="viewprofilecc">
                    <a href="viewprofile">
                        <img Class="viewprofilecc" src={viewprofile} alt="profile"/>
                    </a>
                    </div>
                    <div Class="viewattendancecc">
                    <a href="viewattendance">
                        <img Class="viewattendancecc" src={viewattendance} alt=""/>
                    </a>
                    </div>
                    <div Class="viewmissingdayshourscc">
                    <a href="viewmissingdayshours">
                        <img Class="viewmissingdayshourscc" src={viewmissing} alt=""/>
                    </a>
                    </div>
                    <div Class="viewschedulecc">
                    <a href="viewschedule">
                        <img Class="viewschedulecc" src={viewschedule} alt=""/>
                    </a>
                </div>
                </div>
                <div Class="flex-container2">
                <ToastContainer />
                <button Class="signincc" onClick={this.onClicksignin}>
                        <img Class="signinccimg" src={signin} alt=""/>
                </button>
                <button Class="signoutcc" onClick={this.onClicksignout}>
                        <img Class="signoutccimg" src={signout} alt=""/>
                </button>
                </div>
            </div>
        )
    }
}

export default CCHome