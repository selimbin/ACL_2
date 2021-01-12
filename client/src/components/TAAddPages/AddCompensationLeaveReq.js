import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddCompensationLeaveReq extends Component {
    state = {
        id: '',
        reason:'',
        date:'',
        amount:''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const course = {
            id: this.state.id,
            reason:this.state.reason,
            date:this.state.date,
            amount:this.state.amount

        };

        axios.post("http://localhost:5000/staff/CompensationLeaveReq", course,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Request added successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="AddPage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="reason">reason</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="reason" name="reason" placeholder="Enter the reason for the request.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>  
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="date">date</label>
                        </div>
                        <div class="col-75">
                            <input type="Date" id="date" name="date" placeholder="Enter the date for the request.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>  
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="amount">amount</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="amount" name="amount" placeholder="Enter the amount of days for the request.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>  
                    <div class="row">
                        <input type="submit" value="Add"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddCompensationLeaveReq