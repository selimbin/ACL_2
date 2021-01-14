import React, { Component } from 'react'
import Navbar from "../components/Navbar/CCNavbar";
import AssignCC from "../components/CourseCoordinator/Updateslot";

export class UpdateCourseSlot extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignCC/>
            </div>
        )
    }
}

export default UpdateCourseSlot