import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletefaculty from "../../components/DeletePages/DeleteFaculty";

export class DeleteFaculty extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Deletefaculty/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default DeleteFaculty