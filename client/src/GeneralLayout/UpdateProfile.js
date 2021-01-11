import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import Updateprofile from "../components/Services/UpdateProfile";

export class UpdateProfile extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Updateprofile/>
            </div>
        )
    }
}

export default UpdateProfile