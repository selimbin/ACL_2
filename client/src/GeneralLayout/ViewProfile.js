import React, { Component } from 'react'
import Navbar from "./components/Navbar/Navbar";
import Viewprofile from "./components/Services/ViewProfile";

export class ViewProfile extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Viewprofile/>
            </div>
        )
    }
}

export default ViewProfile