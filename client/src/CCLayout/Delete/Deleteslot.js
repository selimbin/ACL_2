import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import DeleteSlot from "../../components/DeletePages/Deleteslot";

export class Deleteslot extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <DeleteSlot/>
            </div>
        )
    }
}

export default Deleteslot