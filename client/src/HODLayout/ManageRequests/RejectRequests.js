import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import RejReq from "../../components/ManageRequestsHOD/RejectRequests";

export class RejectRequests extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <RejReq/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default RejectRequests