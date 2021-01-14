import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'

export class ViewDayOffRequests extends Component {
    state = {staff:[
        axios 
    ]}

    componentDidMount(){
        axios.get("http://localhost:5000/staff/viewChangeDayOff",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        }).then(
          res =>this.setState({staff:res.data}),toast.warning("Loading might take some time",{position: toast.POSITION.TOP_CENTER}))
      }
    render() {
        return (
            <div class="ViewPage">
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
                    {this.state.staff.map((item) => {
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

export default ViewDayOffRequests