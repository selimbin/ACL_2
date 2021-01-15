import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Addcourse from "../../components/AddPages/AddCourse";

export class AddCourse extends Component {
    
    render() {
        const role = sessionStorage.getItem('role')
        if(role==="HR"){
            return (
                <div>
                    <Navbar/>
                    <Addcourse/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default AddCourse