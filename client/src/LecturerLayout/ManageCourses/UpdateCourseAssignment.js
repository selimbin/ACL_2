import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import UpdateAssign from "../../components/ManageCourses/Updateslotassign";

export class UpdateCourseAssignment extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <UpdateAssign/>
                </div>
            )
        }
        if(role==="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <UpdateAssign/>
                </div>
            )
        }
    }
}

export default UpdateCourseAssignment