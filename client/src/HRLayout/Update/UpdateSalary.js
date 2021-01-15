import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatesalary from "../../components/UpdatePages/UpdateSalary";

export class UpdateSalary extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updatesalary/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default UpdateSalary