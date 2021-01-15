import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addfaculty from "../../components/AddPages/AddFaculty";

export class AddFaculty extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Addfaculty/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AddFaculty