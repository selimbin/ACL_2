import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import CancelReq from "../components/Requests/AddcancelRequests";

export class CancelRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <CancelReq/>
                </div>
            )
        }
        if(role==="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <CancelReq/>
                </div>
            )
        }
        if(role==="TA"){
            return (
                <div>
                    <TANavbar/>
                    <CancelReq/>
                </div>
            )
        }
    }
}

export default CancelRequest