import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AddsignInOut from "../../components/AddPages/AddSignInOut";

export class AddSignInOut extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AddsignInOut/>
            </div>
        )
    }
}

export default AddSignInOut