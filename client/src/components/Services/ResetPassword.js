import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css'

export class ResetPassword extends Component {
    state = {
        oldpassword: '',
        newpassword: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const password = {
            oldPassword: this.state.oldpassword,
            newPassword: this.state.newpassword,
        };

        axios.put("http://localhost:5000/staff/resetPassword", password,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')

            }
        })
        .then((res) => toast.success("Password Reset successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="ResetPage">
            <div class="container">
                <form onSubmit={this.mySubmitHandler}>
                <ToastContainer />
                <div class="row">
                    <div class="col-10">
                        <label htmlfor="oldpassword">Old Password</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="oldpassword" name="oldpassword" placeholder="Enter Your old password.." onChange={this.myChangeHandler}></input>
                    </div>
                    <div class="col-10">
                        <label htmlfor="newpassword">New Password</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="newpassword" name="newpassword" placeholder="Enter your new pasword.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <input type="submit" value="Reset"></input>
                </div>
                </form>
            </div>
        </div>
        )
    }
}

export default ResetPassword