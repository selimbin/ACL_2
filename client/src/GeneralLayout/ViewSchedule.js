import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import HODNavbar from "../components/Navbar/HODNavbar";
import TANavbar from "../components/Navbar/CCNavbar";
import LecNavbar from "../components/Navbar/LecNavbar";
import Viewschedule from "../components/Requests/ViewSchedule";

export class ViewSchedule extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Viewschedule/>
                </div>
            )
        }
        if(role=="HOD"){
            return(
            <div>
                <HODNavbar/>
                <Viewschedule/>
            </div>
            )
        }
        if(role=="TA"){
            return(
            <div>
                <TANavbar/>
                <Viewschedule/>
            </div>
            )
        }
        if(role=="Lec"){
            return (
                <div>
                    <LecNavbar/>
                    <Viewschedule/>
                </div>
            )
        }
    }
}

export default ViewSchedule