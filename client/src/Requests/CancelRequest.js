import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import CancelRequest from "../components/ManageDepartment/DeleteStaffCourse";

export class CancelRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <CancelRequest/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <CancelRequest/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <CancelRequest/>
                </div>
            )
        }
    }
}

export default CancelRequest