import React, { Component } from 'react'
import HODNavbar from "../components/Navbar/HODNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import Navbar from "../components/Navbar/Navbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import Viewmissingdayshours from "../components/Services/ViewMissingDaysHours";
import Resetpassword from "./ResetPassword";

export class ViewMissingDaysHours extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Viewmissingdayshours/>
                </div>
            )
        }
        if(role=="HOD"){
            return (
                <div>
                    <HODNavbar/>
                    <Viewmissingdayshours/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <Viewmissingdayshours/>
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

export default ViewMissingDaysHours