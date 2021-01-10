import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletedepartment from "../../components/DeletePages/DeleteDepartment";

export class DeleteDepartment extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Deletedepartment/>
            </div>
        )
    }
}

export default DeleteDepartment