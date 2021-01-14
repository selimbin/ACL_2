import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import UpdateSlot from "../../components/UpdatePages/Updateslot";

export class Updateslot extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <UpdateSlot/>
            </div>
        )
    }
}

export default Updateslot