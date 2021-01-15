import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'

export class ViewMissing extends Component {
    state = {staff:[
        axios 
    ]}

    componentDidMount(){
        axios.get("http://localhost:5000/staff/Viewmissed",{
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
                        <th>id</th>
                        <th>name</th>
                        <th>missing days</th>
                        <th>missing hours</th>
                    </tr>
                    {this.state.staff.map((item) => {
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

export default ViewMissing