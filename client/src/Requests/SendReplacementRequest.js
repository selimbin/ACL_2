import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import RepReq from "../components/Requests/AddReplacmentReq";

export class SendReplacementRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <RepReq/>
                </div>
            )
        }
        if(role==="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <RepReq/>
                </div>
            )
        }
        if(role==="TA"){
            return (
                <div>
                    <TANavbar/>
                    <RepReq/>
                </div>
            )
        }
    }
}

export default SendReplacementRequest