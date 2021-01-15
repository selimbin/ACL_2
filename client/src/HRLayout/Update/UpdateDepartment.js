import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatedepartment from "../../components/UpdatePages/UpdateDepartment";

export class UpdateDepartment extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updatedepartment/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default UpdateDepartment