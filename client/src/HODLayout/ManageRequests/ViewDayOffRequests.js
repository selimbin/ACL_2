import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import ViewDayOff from "../../components/ManageRequestsHOD/ViewDayOffRequests";

export class ViewDayOffRequests extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewDayOff/>
            </div>
        )
    }
}

export default ViewDayOffRequests