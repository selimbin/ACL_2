import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import DeleteSlotassign from "../../components/UpdatePages/Deleteslotassign";

export class Deleteslotassign extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <DeleteSlotassign/>
            </div>
        )
    }
}

export default Deleteslotassign