import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import ViewSlotAssign from "../../components/ManageCourses/Viewslotassignment";

export class ViewCourseSlotAssignment extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewSlotAssign/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <ViewSlotAssign/>
                </div>
            )
        }
    }
}

export default ViewCourseSlotAssignment