import React, { Component } from 'react'
import Navbar from "../components/Navbar/CCNavbar";
import AssignCC from "../components/CourseCoordinator/Viewslotlinkingreq";

export class ViewSlotLinkingRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="TA"){
            return (
                <div>
                    <Navbar/>
                    <AssignCC/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewSlotLinkingRequest