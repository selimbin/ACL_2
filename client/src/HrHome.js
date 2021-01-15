import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./components/Navbar/Navbar";
import viewprofile from './components/Images/View_Profile.jpeg';
import signin from './components/Images/SignIn.jpg';
import signout from './components/Images/SignOut.jpeg';
import viewattendance from './components/Images/ViewAttendance.jpeg';
import viewmissing from './components/Images/ViewMissing.jpg';
import './HrHome.css'

export class HrHome extends Component {

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
                <Navbar/>
                <div Class="flex-container1">
                    <div Class="viewprofilehr">
                    <a href="viewprofile">
                        <img Class="viewprofilehr" src={viewprofile} alt="profile"/>
                    </a>
                    </div>
                    <div Class="viewattendancehr">
                    <a href="viewattendance">
                        <img Class="viewattendancehr" src={viewattendance}/>
                    </a>
                    </div>
                    <div Class="viewmissingdayshourshr">
                    <a href="viewmissingdayshours">
                        <img Class="viewmissingdayshourshr" src={viewmissing}/>
                    </a>
                    </div>
                </div>
                <div Class="flex-container2">
                <ToastContainer />
                <button Class="signinhr" onClick={this.onClicksignin}>
                        <img Class="signinhr" src={signin}/>
                    </button>
                <button Class="signouthr" onClick={this.onClicksignout}>
                        <img Class="signouthr" src={signout}/>
                </button>
                </div>
            </div>
        )
    }
}

export default HrHome