import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import ViewRepReq from  "../components/Requests/ViewReplacementReq";

export class ViewReplacementRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewRepReq/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <ViewRepReq/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <ViewRepReq/>
                </div>
            )
        }
    }
}

export default ViewReplacementRequest