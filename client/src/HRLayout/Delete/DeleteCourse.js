import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Deletecourse from "../../components/DeletePages/DeleteCourse";

export class DeleteCourse extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Deletecourse/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default DeleteCourse