import React, { Component } from 'react'
import Navbar from "../components/Navbar/CCNavbar";
import AssignCC from "../components/CourseCoordinator/Acceptslotrequest";

export class AcceptSlotLinking extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignCC/>
            </div>
        )
    }
}

export default AcceptSlotLinking