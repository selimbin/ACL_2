import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import ViewCoverage from "../../components/ManageDepartment/DeleteStaffCourse";

export class ViewCourseCoverageLec extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewCoverage/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <ViewCoverage/>
                </div>
            )
        }
    }
}

export default ViewCourseCoverageLec