import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import ViewDayOff from "../../components/ManageRequestsHOD/ViewDayOffRequests";

export class ViewDayOffRequests extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewDayOff/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewDayOffRequests