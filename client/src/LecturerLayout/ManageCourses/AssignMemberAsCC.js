import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import AssignCC from "../../components/ManageCourses/Assigncoordinator";

export class AssignMemberAsCC extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <AssignCC/>
                </div>
            )
        }
        if(role==="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <AssignCC/>
                </div>
            )
        }
    }
}

export default AssignMemberAsCC