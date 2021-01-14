import React, { Component } from 'react';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'


export class ViewRequests extends Component {
    state = {
        value:'',
        staff:[axios]
    }

    mySubmitHandler = async event => {
        event.preventDefault();

        if(this.state.value=="All"){
            await axios.get("http://localhost:5000/staff/viewAllRequests",{
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
        if(this.state.value=="Rejected"){
            await axios.get("http://localhost:5000/staff/viewRejectedRequests",{
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
        if(this.state.value=="Accepted"){
            await axios.get("http://localhost:5000/staff/viewAcceptedRequests",{
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
        if(this.state.value=="Pending"){
            await axios.get("http://localhost:5000/staff/viewPendingRequests",{
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

        if(this.state.value==""){
            toast.error("Choose Request Status",{position: toast.POSITION.TOP_CENTER})
        }
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
                    <label>
                    Status of Requests:
                    <select name = 'value' value={this.state.value} onChange={this.myChangeHandler}>
                        <option value=""></option>
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    </label>
                    </div>
                    <div class="row">
                        <input type="submit" value="Get Requests"></input>
                    </div>
                    </form>
                </div>
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>_id</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Response</th>
                        <th>Requester ID</th>
                        <th>Receiver ID</th>
                        <th>New Day</th>
                        <th>Replacement</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                    {this.state.staff.map((item)=>{
                            return (
                                <tr>
                                    <td>{item._id}</td>
                                    <td>{item.status}</td>
                                    <td>{item.type}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.response}</td>
                                    <td>{item.requester}</td>
                                    <td>{item.receiver}</td>
                                    <td>{item.newDay}</td>
                                    <td>{item.replacement}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.date}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewRequests