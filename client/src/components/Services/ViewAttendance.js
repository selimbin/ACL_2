import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewAttendance.css'

export class ViewAttendance extends Component {
    state = {
        month:'',
        attendance:[
        axios
    ]}

    mySubmitHandler = event => {
        event.preventDefault();

        const month = {
            month: this.state.month
        };

        axios.post("http://localhost:5000/staff/viewAttendance", month,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmZjMTNjN2RmNWMyZDBjMTNjZjhmMGIiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MTA0MDA1MDZ9.-i-mNE4ZyzEa3N_UJADpbq3d_lZV4e8siRvspLcuhf4",
            }
        }).then(
          res => this.setState({attendance:res.data}))
          .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
      }

      myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        return (
            <div class="viewattended">
            <div class="container">
                <form onSubmit={this.mySubmitHandler}>
                <ToastContainer />
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="month">Month</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="month" name="month" placeholder="Enter a month.." onChange={this.myChangeHandler}></input>
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
                        <th>day</th>
                        <th>date</th>
                        <th>attended</th>
                    </tr>
                    {this.state.attendance.map((item) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.day}</td>
                                    <td>{item.date}</td>
                                    <td>Attended</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewAttendance