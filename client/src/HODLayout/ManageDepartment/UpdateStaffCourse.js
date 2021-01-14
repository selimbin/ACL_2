import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import UpdateStaff from "../../components/ManageDepartment/UpdateStaffCourse";

export class UpdateStaffCourse extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <UpdateStaff/>
            </div>
        )
    }
}

export default UpdateStaffCourse