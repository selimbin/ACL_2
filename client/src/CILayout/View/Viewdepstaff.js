import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import ViewDepstaff from "../../components/ViewPages/Viewdepstaff";

export class Viewdepstaff extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewDepstaff/>
            </div>
        )
    }
}

export default Viewdepstaff