import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addlocation from "../../components/AddPages/AddLocation";

export class AddLocation extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Addlocation/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AddLocation