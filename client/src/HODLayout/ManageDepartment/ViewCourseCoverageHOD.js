import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import CourseCoverage from "../../components/ManageDepartment/ViewCourseCoverageHOD";

export class ViewCourseCoverageHOD extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <CourseCoverage/>
            </div>
        )
    }
}

export default ViewCourseCoverageHOD