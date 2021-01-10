import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatefaculty from "../../components/UpdatePages/UpdateFaculty";

export class UpdateFaculty extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updatefaculty/>
            </div>
        )
    }
}

export default UpdateFaculty