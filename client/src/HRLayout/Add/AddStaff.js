import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addstaff from "../../components/AddPages/AddStaff";

export class AddStaff extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Addstaff/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AddStaff