import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import DeleteAssign from "../../components/ManageCourses/Deleteslotassign";

export class DeleteCourseAssignment extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <DeleteAssign/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <DeleteAssign/>
                </div>
            )
        }
    }
}

export default DeleteCourseAssignment