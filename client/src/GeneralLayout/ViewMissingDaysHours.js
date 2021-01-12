import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import Viewmissingdayshours from "../components/Services/ViewMissingDaysHours";

export class ViewMissingDaysHours extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Viewmissingdayshours/>
            </div>
        )
    }
}

export default ViewMissingDaysHours