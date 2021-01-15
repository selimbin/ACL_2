import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import DeleteStaff from "../../components/ManageDepartment/DeleteStaffCourse";

export class DeleteStaffCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <DeleteStaff/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default DeleteStaffCourse