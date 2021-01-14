import React, { Component } from 'react'
import Navbar from "../../components/Navbar/HODNavbar";
import LecNavbar from "../../components/Navbar/LecNavbar";
import ViewStaff from "../../components/ManageCourses/Viewdepstaff";

export class ViewAllDepStaff extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HOD"){
            return (
                <div>
                    <Navbar/>
                    <ViewStaff/>
                </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <ViewStaff/>
                </div>
            )
        }
    }
}

export default ViewAllDepStaff