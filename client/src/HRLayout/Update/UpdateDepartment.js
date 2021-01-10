import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatedepartment from "../../components/UpdatePages/UpdateDepartment";

export class UpdateDepartment extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updatedepartment/>
            </div>
        )
    }
}

export default UpdateDepartment