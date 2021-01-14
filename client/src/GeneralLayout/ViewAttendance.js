import React, { Component } from 'react'
import HODNavbar from "../components/Navbar/HODNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import Navbar from "../components/Navbar/Navbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import Viewattendance from "../components/Services/ViewAttendance";
import Resetpassword from "./ResetPassword";

export class ViewAttendance extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Viewattendance/>
                </div>
            )
        }
        if(role=="HOD"){
            return (
                <div>
                    <HODNavbar/>
                    <Viewattendance/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <Viewattendance/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <Resetpassword/>
                </div>
            )
        }
    }
}

export default ViewAttendance