import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatefaculty from "../../components/UpdatePages/UpdateFaculty";

export class UpdateFaculty extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updatefaculty/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default UpdateFaculty