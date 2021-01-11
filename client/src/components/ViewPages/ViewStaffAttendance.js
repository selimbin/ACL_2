import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'
import useToken from '../useToken.js';

export class ViewStaffAttendance extends Component {
    // const [token, setToken] = useState();
    
    state = {
        id:'',
        staff:[axios]
    }

    mySubmitHandler = async event => {
        const { token, setToken } = useToken();
        event.preventDefault();

        const staff = {
            id:this.state.id
        }

        await axios.post("http://localhost:5000/staff/viewStaffAttendance", staff ,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":token,
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
                                    <td>{item.signIn}</td>
                                    <td>{item.signOut}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewStaffAttendance