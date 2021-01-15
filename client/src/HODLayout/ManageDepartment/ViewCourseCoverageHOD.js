import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import CourseCoverage from "../../components/ManageDepartment/ViewCourseCoverageHOD";

export class ViewCourseCoverageHOD extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <CourseCoverage/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewCourseCoverageHOD