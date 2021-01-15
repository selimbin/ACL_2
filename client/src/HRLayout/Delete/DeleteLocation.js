import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletelocation from "../../components/DeletePages/DeleteLocation";

export class DeleteLocation extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Deletelocation/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default DeleteLocation