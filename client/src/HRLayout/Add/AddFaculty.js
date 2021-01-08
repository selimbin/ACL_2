import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addfaculty from "../../components/AddPages/AddFaculty";

export class AddFaculty extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Addfaculty/>
            </div>
        )
    }
}

export default AddFaculty