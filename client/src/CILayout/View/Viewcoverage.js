import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import ViewCoverage from "../../components/ViewPages/Viewcoverage";

export class Viewcoverage extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewCoverage/>
            </div>
        )
    }
}

export default Viewcoverage