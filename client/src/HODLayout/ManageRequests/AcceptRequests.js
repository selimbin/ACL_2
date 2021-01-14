import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import AcceptReq from "../../components/ManageRequestsHOD/AcceptRequests";

export class AcceptRequests extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AcceptReq/>
            </div>
        )
    }
}

export default AcceptRequests