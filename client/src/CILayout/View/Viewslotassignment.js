import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import ViewSlotassignment from "../../components/ViewPages/Viewslotassignment";

export class Viewslotassignment extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewSlotassignment/>
            </div>
        )
    }
}

export default Viewslotassignment