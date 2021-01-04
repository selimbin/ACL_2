import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Adddepartment from "../../components/AddPages/AddDepartment";

export class AddDepartment extends Component {
    render() {
        return (
            <div class="AddPage">
                <Navbar/>
                <Adddepartment/>
            </div>
        )
    }
}

export default AddDepartment