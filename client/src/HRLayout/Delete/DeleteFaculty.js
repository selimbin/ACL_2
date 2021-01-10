import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletefaculty from "../../components/DeletePages/DeleteFaculty";

export class DeleteFaculty extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Deletefaculty/>
            </div>
        )
    }
}

export default DeleteFaculty