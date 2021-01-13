import React, { Component } from 'react'
import Navbar from "../components/Navbar/HODNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import SlotReq from "../components/ManageDepartment/DeleteStaffCourse";

export class SendSlotLinkingRequest extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <SlotReq/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <SlotReq/>
                </div>
            )
        }
        if(role=="TA"){
            return (
                <div>
                    <TANavbar/>
                    <SlotReq/>
                </div>
            )
        }
    }
}

export default SendSlotLinkingRequest