import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import RejReq from "../../components/ManageRequestsHOD/RejectRequests";

export class RejectRequests extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <RejReq/>
            </div>
        )
    }
}

export default RejectRequests