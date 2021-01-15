import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import ViewDepartment from "../../components/ManageDepartment/ViewDepartmentStaff";

export class ViewDepartmentStaff extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewDepartment/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewDepartmentStaff