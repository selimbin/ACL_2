import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import ViewDepartment from "../../components/ManageDepartment/ViewDepartmentStaff";

export class ViewDepartmentStaff extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewDepartment/>
            </div>
        )
    }
}

export default ViewDepartmentStaff