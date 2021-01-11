import React, { Component } from 'react';
import { MenuItems } from "./HRMenuItems";
import axios from "axios";
import './Navbar.css'

class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked})
    }

    logout = event => {
        event.preventDefault();

        axios.post("http://localhost:5000/staff/logout", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmZjMTNjN2RmNWMyZDBjMTNjZjhmMGIiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MTA0MDA1MDZ9.-i-mNE4ZyzEa3N_UJADpbq3d_lZV4e8siRvspLcuhf4"
            }})
        .then((res) => window.location.href='/Login')
        .catch((err) => console.log(err.eresponse.data.msg))
    }  

    render(){
        return(
                <nav class="NavbarItems">
                    <h1 Class="navbar-logo">GUC<i class="fas fa-university"></i></h1>
                        <div Class="menu-icon" onClick={this.handleClick}>
                            <i Class={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                        </div>
                    <ul Class={this.state.clicked ? 'nav-menu active':'nav-menu'}>
                        {MenuItems.map((item,index) => {
                            return (
                                <li key={index}>
                                    <div class="dropdown">
                                        <a Class={item.cName} href ={item.url}>
                                            {item.title}
                                        </a>
                                        <div Class="dropdown-content">
                                            {item.dropdown.map((item,index) => {
                                                return (
                                                    <li key={index}>
                                                        <a Class={item.cName} href ={item.url}>
                                                            {item.title}
                                                        </a>
                                                    </li>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <button class="button" onClick={this.logout} ><span>LogOut </span></button>
                </nav>
            )
        }
}

export default Navbar