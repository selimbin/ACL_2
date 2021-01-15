import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatelocation from "../../components/UpdatePages/UpdateLocation";

export class UpdateLocation extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updatelocation/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default UpdateLocation