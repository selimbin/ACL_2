import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AssignCoordinator from "../../components/UpdatePages/Assigncoordinator";

export class Assigncoordinator extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignCoordinator/>
            </div>
        )
    }
}

export default Assigncoordinator