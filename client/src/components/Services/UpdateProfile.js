import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateProfile.css'

export class UpdateProfile extends Component {
    state = {
        oldPassword: '',
        newPassword: '',
        officeLocation: '',
        email: '',
        dayOff: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const profile = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            officeLocation: this.state.officeLocation,
            email: this.state.email,
            dayOff: this.state.dayOff,
        };

        axios.put("http://localhost:5000/staff/updateProfile", profile,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Profile Updated successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="UpdateProfilePage">
            <div class="container">
                <form onSubmit={this.mySubmitHandler}>
                <ToastContainer />
                <div class="row">
                    <div class="col-10">
                        <label htmlfor="oldPassword">Old Password</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="oldPassword" name="oldPassword" placeholder="Enter your old password.." onChange={this.myChangeHandler}></input>
                    </div>
                    <div class="col-10">
                        <label htmlfor="newPassword">New Password</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="newPassword" name="newPassword" placeholder="Enter your new password.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="officeLocation">New Office Location</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="officeLocation" name="officeLocation" placeholder="Enter your new office location.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="email">New Email</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="email" name="email" placeholder="Enter your new email.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="dayOff">New Dayoff</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="dayOff" name="dayOff" placeholder="Enter your new dayoff.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>  
                <div class="row">
                    <input type="submit" value="Update"></input>
                </div>
                </form>
            </div>
        </div>
        )
    }
}

export default UpdateProfile