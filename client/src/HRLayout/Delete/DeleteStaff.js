import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletestaff from "../../components/DeletePages/DeleteStaff";

export class DeleteStaff extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Deletestaff/>
            </div>
        )
    }
}

export default DeleteStaff