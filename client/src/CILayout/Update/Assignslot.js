import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AssignSlot from "../../components/UpdatePages/Assignslot";

export class Assignslot extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AssignSlot/>
            </div>
        )
    }
}

export default Assignslot