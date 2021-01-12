import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'

export class ViewSchedule extends Component{
    state = {
        id:'',
        Schedule:[axios]
    }

    mySubmitHandler = event => {
    event.preventDefault();

    const Schedule = {
        id:this.state.id
    }
    axios.post("http://localhost:5000/staff/viewSchedule", Schedule ,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then(res =>this.setState({Schedule:res.data}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        /*return (
            <div class="ViewPage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">ID</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="id" name="id" placeholder="Enter the Staff id.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" value="Search"></input>
                    </div>
                    </form>
                </div>
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>month</th>
                        <th>day</th>
                        <th>date</th>
                        <th>SignIns</th>
                        <th>SignOuts</th>
                    </tr>
                    {this.state.staff.map((item) => {
                            return (
                                <tr>
                                    <td>{item.month}</td>
                                    <td>{item.day}</td>
                                    <td>{item.date}</td>
                                    <td>{this.state.signins.map((n) => {
                                        return (
                                            <li>{n}</li>
                                        )
                                    })}</td>
                                    <td>{this.state.signouts.map((n) => {
                                        return (
                                            <li>{n}</li>
                                        )
                                    })}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }*/
}
}
//export default ViewSchedule