import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import HODNavbar from "../components/Navbar/HODNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import Resetpassword from "../components/Services/ResetPassword";

export class ResetPassword extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Resetpassword/>
                </div>
            )
        }
        if(role==="HOD"){
            return (
                <div>
                    <HODNavbar/>
                    <Resetpassword/>
                </div>
            )
        }
        if(role==="TA"){
            return (
                <div>
                    <TANavbar/>
                    <Resetpassword/>
                </div>
            )
        }
        if(role==="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <Resetpassword/>
                </div>
            )
        }
    }
}

export default ResetPassword