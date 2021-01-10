import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Viewstaffattendance from "../../components/ViewPages/ViewStaffAttendance";

export class ViewStaffAttendance extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Viewstaffattendance/>
            </div>
        )
    }
}

export default ViewStaffAttendance