import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletelocation from "../../components/DeletePages/DeleteLocation";

export class DeleteLocation extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Deletelocation/>
            </div>
        )
    }
}

export default DeleteLocation