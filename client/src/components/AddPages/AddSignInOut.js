import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddSignInOut extends Component {
    state = {
        id: '',
        date: '',
        time: '',
    };

    mySubmitHandler1 = event => {
        event.preventDefault();

            const signout = {
                id: this.state.id,
                date: this.state.date,
                Time: this.state.time,
            };
    
            axios.post("http://localhost:5000/staff/AddsignOut", signout,{
                headers:
                {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type":"application/JSON",
                    "token":sessionStorage.getItem('token')
                }
            })
            .then((res) => toast.success("Sign out record added successfully",{position: toast.POSITION.TOP_CENTER}))
            .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))

    }    

    mySubmitHandler2 = event => {
        event.preventDefault();

            const signin = {
                id: this.state.id,
                date: this.state.date,
                Time: this.state.time,
            };
    
            axios.post("http://localhost:5000/staff/AddsignIn", signin,{
                headers:
                {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type":"application/JSON",
                    "token":sessionStorage.getItem('token')
                }
            })
            .then((res) => toast.success("Sign in record added successfully",{position: toast.POSITION.TOP_CENTER}))
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
                    <form>
                    <ToastContainer />
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Staff ID</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="id" name="id" placeholder="Enter the Staff ID.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="date">Date</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="date" name="date" placeholder="Enter the date Ex: 01/07/2021" onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="time">Time</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="time" name="time" placeholder="Enter the time Ex: 10:30" onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <input type="submit" name="Signout" value="Add SignOut" onClick={this.mySubmitHandler1}></input>
                        <input type="submit" name="Signin" value="Add SignIn" onClick={this.mySubmitHandler2}></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddSignInOut