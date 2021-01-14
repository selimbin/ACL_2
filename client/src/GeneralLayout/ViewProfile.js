import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import HODNavbar from "../components/Navbar/HODNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import Viewprofile from "../components/Services/ViewProfile";
import Resetpassword from "./ResetPassword";

export class ViewProfile extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Viewprofile/>
                </div>
            )
        }
        if(role=="HOD"){
            return(
            <div>
                <HODNavbar/>
                <Viewprofile/>
            </div>
            )
        }
        if(role=="TA"){
            return(
            <div>
                <TANavbar/>
                <Viewprofile/>
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

export default ViewProfile