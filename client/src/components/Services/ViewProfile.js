import React, { Component } from 'react';
import axios from "axios";
import './ViewProfile.css'

export class ViewProfile extends Component {
    state = {
        profile:axios,
        courses:[] 
    }

    componentDidMount(){
        axios.get("http://localhost:5000/staff/viewProfile",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        }).then(
          res =>this.setState({profile:res.data,courses:res.data.course}))
      }
    render() {
        return (
            <div class="profileview">
            <div class="container">
	            <div class="row">
		            <div class="col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
    	                <div class="well profile">
                            <div class="col-sm-12">
                                <ul class="col-xs-12 col-sm-8">
                                    <h2>{this.state.profile.name}</h2>
                                    <li Class="test"><strong>Email: </strong>{this.state.profile.email}</li>
                                    <li Class="test"><strong>Role: </strong>{this.state.profile.role}</li>
                                    <li Class="test"><strong>Dayoff: </strong>{this.state.profile.dayOff}</li>
                                    <li Class="test"><strong>Office location: </strong>{this.state.profile.officeLocation}</li>
                                    <li Class="test"><strong>Department: </strong>{this.state.profile.department}</li>
                                    <li Class="test"><strong>Leave Balance: </strong>{this.state.profile.leaveBalance}</li>
                                    <li Class="test"><strong>Courses: </strong>
                                        {this.state.courses.map((item) => {
                                            return (
                                                <span class="tags">{item}</span> 
                                            )
                                        })}
                                    </li>
                                </ul>             
                            </div>            
    	                </div>                 
		            </div>
	            </div>
            </div>
            </div>
        )
    }
}

export default ViewProfile