import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletedepartment from "../../components/DeletePages/DeleteDepartment";

export class DeleteDepartment extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Deletedepartment/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default DeleteDepartment