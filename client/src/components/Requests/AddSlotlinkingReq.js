import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddSlotlinkingReq extends Component {
    state = {
        id: '',
        code: '',
        date:'',
        receiver:'',
        reason:'',
        slot:'',
        location:''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const request = {
            id: this.state.id,
            course: this.state.code,
            date:this.state.date,
            receiver:this.state.receiver,
            reason:this.state.reason,
            slot:this.state.slot,
            location:this.state.location
        };

        axios.post("http://localhost:5000/staff/slotlinkingrequest", request,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
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
                            <label htmlfor="code">Course Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="code" name="code" placeholder="Enter the request course code.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="date">date</label>
                        </div>
                        <div class="col-75">
                            <input type="Date" id="date" name="date" placeholder="Enter the request date.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="receiver">receiver</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="receiver" name="receiver" placeholder="Enter the reciever of the request.." onChange={this.myChangeHandler}></input>
                        </div>
                        </div> 
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
                            <label htmlfor="slot">slot</label>
                        </div>
                        <div class="col-75">
                            <input type="number" id="slot" name="slot" placeholder="Enter the slot for the request.." onChange={this.myChangeHandler}></input>
                        </div>
                        </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="location">location</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="location" name="location" placeholder="Enter the location for the request.." onChange={this.myChangeHandler}></input>
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

export default AddSlotlinkingReq