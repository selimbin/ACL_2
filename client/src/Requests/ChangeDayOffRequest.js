import React, { Component } from 'react'
import Navbar from ".../components/Navbar/HODNavbar";
import LecNavbar from ".../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import ChangeDOReq from "../components/ManageDepartment/DeleteStaffCourse";

export class ChangeDayOffRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ChangeDOReq/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <ChangeDOReq/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <ChangeDOReq/>
                </div>
            )
        }
    }
}

export default ChangeDayOffRequest