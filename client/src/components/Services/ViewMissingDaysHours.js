import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewMissingDaysHours.css'

export class ViewMissingDaysHours extends Component {
    state = {days:[
        axios
    ],
    hours:[
        axios
    ]}

    componentDidMount(){
        axios.get("http://localhost:5000/staff/viewMissingDays",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxYTk0NTQyOTY3MTA2ZjRlNmQ0ZTciLCJyb2xlIjoibGVjdHVyZXIiLCJpYXQiOjE2MTAzMDIwOTF9.FLCkX5Zsjk_omdH-M4k_diewI28Vl22uLlEgG_kEjNE",
            }
        }).then(
          res =>this.setState({days:res.data}))
          .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))

          axios.get("http://localhost:5000/staff/viewMissingHours",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        }).then(
          res =>this.setState({hours:res.data}))
          .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
      }
    render() {
        return (
            <div class="Viewmiss">
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>missed days</th>
                        <th>missed hours</th>
                    </tr>
                    {this.state.days.map((item) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.missedDays}</td>
                                    <td>{item.missedHours}</td>
                                </tr>
                            )
                        })}
                        {this.state.hours.map((item) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.missedDays}</td>
                                    <td>{item.missedHours}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewMissingDaysHours