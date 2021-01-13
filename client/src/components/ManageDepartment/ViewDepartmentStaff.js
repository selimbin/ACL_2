import React, { Component } from 'react';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'


export class ViewDepartmentStaff extends Component {
    state = {
        value:'',
        course:'',
        staff:[axios]
    }

    mySubmitHandler = async event => {
        event.preventDefault();

        const staff = {
            view:this.state.value,
            course:this.state.course
        }
        await axios.post("http://localhost:5000/staff/viewStaff", staff ,{
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
                    <label>
                    Pick your view target:
                    <select name = 'value' value={this.state.value} onChange={this.myChangeHandler}>
                        <option value=""></option>
                        <option value="department">Department</option>
                        <option value="course">Course</option>
                    </select>
                    </label>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Course</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="course" name="course" placeholder="Enter Course Code IF your view is Course  .." onChange={this.myChangeHandler}></input>
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
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Leave Balance</th>
                    </tr>
                    {this.state.staff.map((item)=>{
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.department}</td>
                                    <td>{item.role}</td>
                                    <td>{item.salary}</td>
                                    <td>{item.leaveBalance}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewDepartmentStaff