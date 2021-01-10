import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletecourse from "../../components/DeletePages/DeleteCourse";

export class DeleteCourse extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Deletecourse/>
            </div>
        )
    }
}

export default DeleteCourse