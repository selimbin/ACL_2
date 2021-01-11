import React, { Component } from 'react';
import { MenuItems } from "./HRMenuItems";
import './Navbar.css'

class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked})
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
                    <button class="button"><span>LogOut </span></button>
                </nav>
            )
        }
}

export default Navbar