import React, { Component } from 'react'
import Navbar from "./components/Navbar/Navbar";
import HODNavbar from "./components/Navbar/HODNavbar";
import TANavbar from "./components/Navbar/CCNavbar";
import LecNavbar from "./components/Navbar/LecNavbar";
import HRHome from "./HrHome";
import CCHome from "./CCHome";
import HODHome from "./HODHome";
import LecHome from "./LecHome";

export class ResetPassword extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <HRHome/>
                </div>
            )
        }
        if(role=="HOD"){
            return (
                <div>
                    <HODNavbar/>
                    <HODHome/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <CCHome/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <LecHome/>
                </div>
            )
        }
        else{
            return window.location.href='/Login' ;
        }
    }
}

export default ResetPassword