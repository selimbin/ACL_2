import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import RemoveMem from "../../components/ManageDepartment/DeleteStaffCourse";

export class RemoveMemberFromCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <RemoveMem/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <RemoveMem/>
                </div>
            )
        }
    }
}

export default RemoveMemberFromCourse