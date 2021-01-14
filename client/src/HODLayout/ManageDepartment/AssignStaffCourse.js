import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import AssignStaff from "../../components/ManageDepartment/AssignStaffCourse";

export class AssignStaffCourse extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignStaff/>
            </div>
        )
    }
}

export default AssignStaffCourse