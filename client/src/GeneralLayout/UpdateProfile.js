import React, { Component } from 'react'
import HODNavbar from "../components/Navbar/HODNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import Navbar from "../components/Navbar/Navbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import Updateprofile from "../components/Services/UpdateProfile";

export class UpdateProfile extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updateprofile/>
                </div>
            )
        }
        if(role==="HOD"){
            return (
                <div>
                    <HODNavbar/>
                    <Updateprofile/>
                </div>
            )
        }
        if(role==="TA"){
            return (
                <div>
                    <TANavbar/>
                    <Updateprofile/>
                </div>
            )
        }

        if(role==="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <Updateprofile/>
                </div>
            )
        }
    }
}

export default UpdateProfile