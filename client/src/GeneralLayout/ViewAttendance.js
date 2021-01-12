import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import Viewattendance from "../components/Services/ViewAttendance";

export class ViewAttendance extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Viewattendance/>
            </div>
        )
    }
}

export default ViewAttendance