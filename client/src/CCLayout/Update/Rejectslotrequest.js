import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import RejectSlotrequest from "../../components/UpdatePages/Rejectslotrequest";

export class Rejectslotrequest extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <RejectSlotrequest/>
            </div>
        )
    }
}

export default Rejectslotrequest