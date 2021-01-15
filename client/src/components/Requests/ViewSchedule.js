import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'

export class ViewSchedule extends Component{
    state = {
        slot1:[axios],
        slot2:[axios],
        slot3:[axios],
        slot4:[axios],
        slot5:[axios]
    }

    componentDidMount(){
    axios.get("http://localhost:5000/staff/viewschedule",{
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
    render() {
        return (
            <div class="ViewPage">
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
export default ViewSchedule 