import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletestaff from "../../components/DeletePages/DeleteStaff";

export class DeleteStaff extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Deletestaff/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default DeleteStaff