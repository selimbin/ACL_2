import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import UpdateStaff from "../../components/ManageDepartment/UpdateStaffCourse";

export class UpdateStaffCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <UpdateStaff/>
                </div>
            )
        }
        else{
            window.location.href='/Login';
        }
    }
}

export default UpdateStaffCourse