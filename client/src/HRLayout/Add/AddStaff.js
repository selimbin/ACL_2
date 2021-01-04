import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addstaff from "../../components/AddPages/AddStaff";

export class AddStaff extends Component {
    render() {
        return (
            <div class="AddPage">
                <Navbar/>
                <Addstaff/>
            </div>
        )
    }
}

export default AddStaff