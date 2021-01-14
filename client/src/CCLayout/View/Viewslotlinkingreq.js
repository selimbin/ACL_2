import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import ViewSlotlinkingreq from "../../components/ViewPages/Viewslotlinkingreq";

export class Viewslotlinkingreq extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <ViewSlotlinkingreq/>
            </div>
        )
    }
}

export default Viewslotlinkingreq