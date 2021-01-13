import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import ViewDayOff from "../../components/ManageDepartment/ViewDayOffStaff";

export class ViewDayOffStaff extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewDayOff />
            </div>
        )
    }
}

export default ViewDayOffStaff