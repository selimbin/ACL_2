import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AcceptSlotrequest from "../../components/UpdatePages/Acceptslotrequest";

export class Acceptslotrequest extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AcceptSlotrequest/>
            </div>
        )
    }
}

export default Acceptslotrequest