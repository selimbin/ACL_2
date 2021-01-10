import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatelocation from "../../components/UpdatePages/UpdateLocation";

export class UpdateLocation extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updatelocation/>
            </div>
        )
    }
}

export default UpdateLocation