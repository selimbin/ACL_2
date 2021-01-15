import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatestaff from "../../components/UpdatePages/UpdateStaff";

export class UpdateStaff extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updatestaff/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default UpdateStaff