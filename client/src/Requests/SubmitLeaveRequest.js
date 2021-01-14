import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import LeaveReq from "../components/Requests/SubmitLeaveRequest";

export class SubmitLeaveRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <LeaveReq/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <LeaveReq/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <LeaveReq/>
                </div>
            )
        }
    }
}

export default SubmitLeaveRequest