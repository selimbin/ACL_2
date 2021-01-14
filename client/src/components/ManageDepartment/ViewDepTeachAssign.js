import React, { Component } from 'react';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'


export class ViewDepTeachAssign extends Component {
    state = {
        id:'',
        staff:[axios]
    }
    mySubmitHandler = async event => {
        event.preventDefault();

        const x = {
            course:this.state.id
        }
        await axios.post("http://localhost:5000/staff/viewAssignments", x ,{
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
                            <label htmlfor="id">Course Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="id" name="id" placeholder="Enter Course Code ..." onChange={this.myChangeHandler}></input>
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
                        <th></th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                    </tr>

                    {this.state.staff.map((item) => {
                        if(item.saturday){
                            return (
                                <tr>
                                    <th>First</th>
                                    <td>{item.saturday[0]}</td>
                                    <td>{item.sunday[0]}</td>
                                    <td>{item.monday[0]}</td>
                                    <td>{item.tuesday[0]}</td>
                                    <td>{item.wednesday[0]}</td>
                                    <td>{item.thursday[0]}</td>
                                </tr>
                            )
                        }
                        if(item.sunday){
                            return (
                                <tr>
                                    <th>Second</th>
                                    <td>{item.saturday[1]}</td>
                                    <td>{item.sunday[1]}</td>
                                    <td>{item.monday[1]}</td>
                                    <td>{item.tuesday[1]}</td>
                                    <td>{item.wednesday[1]}</td>
                                    <td>{item.thursday[1]}</td>
                                </tr>
                            )
                        }
                        })}
                </table>
            </div>
        )
    }
}

export default ViewDepTeachAssign