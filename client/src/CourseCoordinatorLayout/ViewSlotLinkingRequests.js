import React, { Component } from 'react'
import Navbar from "../components/Navbar/CCNavbar";
import AssignCC from "../components/CourseCoordinator/Viewslotlinkingreq";

export class ViewSlotLinkingRequest extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignCC/>
            </div>
        )
    }
}

export default ViewSlotLinkingRequest