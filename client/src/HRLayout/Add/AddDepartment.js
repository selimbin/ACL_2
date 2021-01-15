import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Adddepartment from "../../components/AddPages/AddDepartment";

export class AddDepartment extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Adddepartment/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AddDepartment