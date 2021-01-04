import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addcourse from "../../components/AddPages/AddCourse";

export class AddCourse extends Component {
    render() {
        return (
            <div class="AddPage">
                <Navbar/>
                <Addcourse/>
            </div>
        )
    }
}

export default AddCourse