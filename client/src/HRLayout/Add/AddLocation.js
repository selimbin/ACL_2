import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addlocation from "../../components/AddPages/AddLocation";

export class AddLocation extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Addlocation/>
            </div>
        )
    }
}

export default AddLocation