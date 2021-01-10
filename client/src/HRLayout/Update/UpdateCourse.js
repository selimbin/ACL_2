import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatecourse from "../../components/UpdatePages/UpdateCourse";

export class UpdateCourse extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updatecourse/>
            </div>
        )
    }
}

export default UpdateCourse