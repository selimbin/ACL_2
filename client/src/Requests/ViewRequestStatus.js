import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import ViewReq from "../components/Requests/ViewRequests";

export class ViewRequestStatus extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewReq/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <ViewReq/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <ViewReq/>
                </div>
            )
        }
    }
}

export default ViewRequestStatus