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
        return (
            <div class="ViewPage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
                    </form>
                </div>
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>Slot1</th>
                        <th>Slot2</th>
                        <th>Slot3</th>
                        <th>Slot4</th>
                        <th>Slot5</th>
                    </tr>
                    {this.state.staff.map((item) => {
                            return (
                                <tr>
                                    <td>{this.state.Slot1.map((n) => {
                                        return (
                                            <li>{n}</li>
                                        )
                                    })}</td>
                                    <td>{this.state.Slot2.map((n) => {
                                        return (
                                            <li>{n}</li>
                                        )
                                    })}</td>
                                    <td>{this.state.Slot3.map((n) => {
                                        return (
                                            <li>{n}</li>
                                        )
                                    })}</td>
                                    <td>{this.state.Slot4.map((n) => {
                                        return (
                                            <li>{n}</li>
                                        )
                                    })}</td>
                                    <td>{this.state.Slot5.map((n) => {
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
    }

}
export default ViewSchedule