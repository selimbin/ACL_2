import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class UpdateStaff extends Component {
    state = {
        id: '',
        name: '',
        email: '',
        officelocation: '',
        role: '',
        dayoff: '',
        department: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const staff = {
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            officelocation: this.state.officelocation,
            role: this.state.role,
            dayoff: this.state.dayoff,
            department: this.state.department,
        };

        axios.put("http://localhost:5000/staff/UpdateStaff", staff,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Staff Updated successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="UpdatePage">
            <div class="container">
                <form onSubmit={this.mySubmitHandler}>
                <ToastContainer />
                <div class="row">
                    <div class="col-10">
                        <label htmlfor="id">ID</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="id" name="id" placeholder="Enter the Staff's id.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="name">New name</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="name" name="name" placeholder="Enter the new Staff's name.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="email">new Email</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="email" name="email" placeholder="Enter the new Email.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="officelocation">new Office Location</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="officelocation" name="officelocation" placeholder="Enter the new Office location.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="role">new role</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="role" name="role" placeholder="Enter the new role.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="dayoff">new dayoff</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="dayoff" name="dayoff" placeholder="Enter the new dayoff.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="department">new department</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="department" name="department" placeholder="Enter the new department.." onChange={this.myChangeHandler}></input>
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

export default UpdateStaff