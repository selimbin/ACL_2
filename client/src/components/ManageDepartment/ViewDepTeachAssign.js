import React, { Component } from 'react';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'


export class ViewDepTeachAssign extends Component {
    state = {
        id:'',
        slot1:[axios],
        slot2:[axios],
        slot3:[axios],
        slot4:[axios],
        slot5:[axios]
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
        .then(res => this.setState({slot1:res.data[0],slot2:res.data[1],slot3:res.data[2],slot4:res.data[3],slot5:res.data[4]}))
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
                        <th>Slot</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                    </tr>

                        {this.state.slot1.map((item) => {
                            return (
                                <tr>
                                    <td>1</td>
                                    <td>{item.saturday}</td>
                                    <td>{item.sunday}</td>
                                    <td>{item.monday}</td>
                                    <td>{item.tuesday}</td>
                                    <td>{item.wednesday}</td>
                                    <td>{item.thursday}</td>
                                </tr>
                            )
                        })}
                        {this.state.slot2.map((item) => {
                            return (
                                <tr>
                                    <td>2</td>
                                    <td>{item.saturday}</td>
                                    <td>{item.sunday}</td>
                                    <td>{item.monday}</td>
                                    <td>{item.tuesday}</td>
                                    <td>{item.wednesday}</td>
                                    <td>{item.thursday}</td>
                                </tr>
                            )
                        })}
                        {this.state.slot3.map((item) => {
                            return (
                                <tr>
                                    <td>3</td>
                                    <td>{item.saturday}</td>
                                    <td>{item.sunday}</td>
                                    <td>{item.monday}</td>
                                    <td>{item.tuesday}</td>
                                    <td>{item.wednesday}</td>
                                    <td>{item.thursday}</td>
                                </tr>
                            )
                        })}
                        {this.state.slot4.map((item) => {
                            return (
                                <tr>
                                    <td>4</td>
                                    <td>{item.saturday}</td>
                                    <td>{item.sunday}</td>
                                    <td>{item.monday}</td>
                                    <td>{item.tuesday}</td>
                                    <td>{item.wednesday}</td>
                                    <td>{item.thursday}</td>
                                </tr>
                            )
                        })}
                        {this.state.slot5.map((item) => {
                            return (
                                <tr>
                                    <td>5</td>
                                    <td>{item.saturday}</td>
                                    <td>{item.sunday}</td>
                                    <td>{item.monday}</td>
                                    <td>{item.tuesday}</td>
                                    <td>{item.wednesday}</td>
                                    <td>{item.thursday}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewDepTeachAssign