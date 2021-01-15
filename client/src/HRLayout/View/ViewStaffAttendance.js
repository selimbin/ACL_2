import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Viewstaffattendance from "../../components/ViewPages/ViewStaffAttendance";

export class ViewStaffAttendance extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Viewstaffattendance/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewStaffAttendance