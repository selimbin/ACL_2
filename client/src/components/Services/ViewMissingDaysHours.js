import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewMissingDaysHours.css'

export class ViewMissingDaysHours extends Component {
    state = {
        days:'',
        hours:''
    }

    componentDidMount(){
        toast.warning("Loading...",{position: toast.POSITION.TOP_CENTER})
        
        axios.get("http://localhost:5000/staff/viewMissingDays",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then(res =>this.setState({days:res.data}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))

        axios.get("http://localhost:5000/staff/viewMissingHours",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then(res =>this.setState({hours:res.data}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }
    render() {
        return (
            <div class="Viewmiss">
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>missed days</th>
                        <th>missed hours</th>
                    </tr>

                    <tr>
                        <td>{this.state.days}</td>
                        <td>{this.state.hours}</td>
                    </tr>
                            )
                </table>
            </div>
        )
    }
}

export default ViewMissingDaysHours