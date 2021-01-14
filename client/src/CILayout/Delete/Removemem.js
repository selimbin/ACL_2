import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import RemoveMem from "../../components/DeletePages/Removemem";

export class Removemem extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <RemoveMem/>
            </div>
        )
    }
}

export default Removemem