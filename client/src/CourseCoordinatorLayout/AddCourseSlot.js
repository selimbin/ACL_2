import React, { Component } from 'react'
import Navbar from "../components/Navbar/CCNavbar";
import AssignCC from "../components/CourseCoordinator/Addslot";

export class AddCourseSlot extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignCC/>
            </div>
        )
    }
}

export default AddCourseSlot