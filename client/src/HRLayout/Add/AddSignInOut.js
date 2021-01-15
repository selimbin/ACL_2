import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AddsignInOut from "../../components/AddPages/AddSignInOut";

export class AddSignInOut extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <AddsignInOut/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AddSignInOut