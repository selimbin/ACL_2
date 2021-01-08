import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Viewmissing from "../../components/ViewPages/ViewMissing";

export class ViewMissing extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Viewmissing/>
            </div>
        )
    }
}

export default ViewMissing