import React, { Component } from 'react'
import Navbar from "../components/Navbar/CCNavbar";
import AssignCC from "../components/CourseCoordinator/Rejectslotrequest";

export class RejectSlotLinking extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignCC/>
            </div>
        )
    }
}

export default RejectSlotLinking