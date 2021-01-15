import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import AcceptReq from "../../components/ManageRequestsHOD/AcceptRequests";

export class AcceptRequests extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <AcceptReq/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AcceptRequests