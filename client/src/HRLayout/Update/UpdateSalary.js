import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatesalary from "../../components/UpdatePages/UpdateSalary";

export class UpdateSalary extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updatesalary/>
            </div>
        )
    }
}

export default UpdateSalary