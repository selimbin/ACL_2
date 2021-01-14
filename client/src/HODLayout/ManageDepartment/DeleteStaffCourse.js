import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import DeleteStaff from "../../components/ManageDepartment/DeleteStaffCourse";

export class DeleteStaffCourse extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <DeleteStaff/>
            </div>
        )
    }
}

export default DeleteStaffCourse