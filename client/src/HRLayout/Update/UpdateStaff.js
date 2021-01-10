import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatestaff from "../../components/UpdatePages/UpdateStaff";

export class UpdateStaff extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updatestaff/>
            </div>
        )
    }
}

export default UpdateStaff