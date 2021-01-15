import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import AssignStaff from "../../components/ManageDepartment/AssignStaffCourse";

export class AssignStaffCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <AssignStaff/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AssignStaffCourse