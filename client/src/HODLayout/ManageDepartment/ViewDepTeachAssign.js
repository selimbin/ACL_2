import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import DepTeachAssign from "../../components/ManageDepartment/ViewDepTeachAssign";

export class ViewDepTeachAssign extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <DepTeachAssign/>
            </div>
        )
    }
}

export default ViewDepTeachAssign