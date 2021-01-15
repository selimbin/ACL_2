import React, { Component } from 'react';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'


export class SubmitLeaveRequest extends Component {
    state = {
        date:'',
        reason:'',
        amount:'',
        staff:[axios],
        value:''
    }

    mySubmitHandler = async event => {
        event.preventDefault();


        if(this.state.value=="Maternity"){
            const staff = {
                date:this.state.date,
                type:"MaternityLeave",
                amount:this.state.amount,
                reason:this.state.reason
            }
            await axios.post("http://localhost:5000/staff/MaternityLeaveReq",staff,{
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
        if(this.state.value=="Compensation"){
            const staff = {
                date:this.state.date,
                type:"CompensationLeave",
                amount:this.state.amount,
                reason:this.state.reason
            }
            await axios.post("http://localhost:5000/staff/CompensationLeaveReq",staff,{
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
        if(this.state.value=="Sick"){
            const staff = {
                date:this.state.date,
                type:"sickleave",
                amount:this.state.amount,
                reason:this.state.reason
            }
            await axios.post("http://localhost:5000/staff/sickleaveReq",staff,{
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
        if(this.state.value=="Annual"){
            const staff = {
                date:this.state.date,
                type:"AnnualLeave",
                amount:this.state.amount,
                reason:this.state.reason
            }
            await axios.post("http://localhost:5000/staff/AnnualLeaveReq",staff,{
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
        if(this.state.value=="Accidental"){
            const staff = {
                date:this.state.date,
                type:"accidentalLeave",
                amount:this.state.amount,
                reason:this.state.reason
            }
            await axios.post("http://localhost:5000/staff/accidentalLeaveReq",staff,{
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
        if(this.state.value==""){
            toast.error("Choose Request Type",{position: toast.POSITION.TOP_CENTER})
        }
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
                    Leave Request Type:
                    <select name = 'value' value={this.state.value} onChange={this.myChangeHandler}>
                        <option value=""></option>
                        <option value="Maternity">Maternity</option>
                        <option value="Compensation">Compensation</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Annual">Annual Leave</option>
                        <option value="Accidental">Accidental Leave</option>
                    </select>
                    </label>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Date</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="date" name="date" placeholder="Enter Start Date of Leave(YYYY-MM-DD)" onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Reason</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="reason" name="reason" placeholder="Explain why you need a leave(might be necessary)" onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Amount</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="amount" name="amount" placeholder="Enter Number of Leave Days" onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" value="Submit Request"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SubmitLeaveRequest