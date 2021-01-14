import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import AssignToCourse from "../../components/ManageCourses/Assignslot";

export class AssignMemberToCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <AssignToCourse/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <AssignToCourse/>
                </div>
            )
        }
    }
}

export default AssignMemberToCourse