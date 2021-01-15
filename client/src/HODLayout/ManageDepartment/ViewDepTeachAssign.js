import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import DepTeachAssign from "../../components/ManageDepartment/ViewDepTeachAssign";

export class ViewDepTeachAssign extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HOD"){
            return (
                <div>
                    <Navbar/>
                    <DepTeachAssign/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewDepTeachAssign