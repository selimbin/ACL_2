import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Updatecourse from "../../components/UpdatePages/UpdateCourse";

export class UpdateCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Updatecourse/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default UpdateCourse