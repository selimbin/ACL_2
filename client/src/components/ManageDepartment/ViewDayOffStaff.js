import React, { Component } from 'react';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'


export class ViewDayOffStaff extends Component {
    state = {
        id:'',
        staff:[axios]
    }

    mySubmitHandler = async event => {
        event.preventDefault();

        const staff = {
            id:this.state.id
        }
        await axios.post("http://localhost:5000/staff/viewDayOff", staff ,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token') 
            }
        })
        .then(res => this.setState({staff:res.data}))
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
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Staff ID (optional)</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="id" name="id" placeholder="Enter Staff ID if you want to view this member's info, if empty you will view entire department info .." onChange={this.myChangeHandler}></input>
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
                        <th>id</th>
                        <th>name</th>
                        <th>day off</th>
                    </tr>
                    {this.state.staff.map((item) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.dayOff}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewDayOffStaff