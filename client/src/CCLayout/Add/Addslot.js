import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AddSlot from "../../components/AddPages/Addslot";

export class Addslot extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AddSlot/>
            </div>
        )
    }
}

export default Addslot