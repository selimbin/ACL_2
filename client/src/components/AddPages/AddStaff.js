import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddStaff extends Component {
    state = {
        name: '',
        email: '',
        officelocation: '',
        gender: '',
        department: '',
        role: '',
        dayoff: '',
        salary: null
    };
    

<<<<<<< HEAD
    mySubmitHandler = async event => {
        const headers = { 
            'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ'
        };
        const info={
=======
    mySubmitHandler = event => {
        event.preventDefault();

        const staff = {
>>>>>>> c949ea99c0cc39b8a7a2bcd99da72aa207113c17
            name: this.state.name,
            email: this.state.email,
            officelocation: this.state.officelocation,
            gender: this.state.gender,
            department: this.state.department,
            role: this.state.role,
            dayoff: this.state.dayoff,
<<<<<<< HEAD
            salary: this.state.salary
        }
        event.preventDefault();
        await axios.post('http://localhost:5000/staff/AddStaff', info, { headers }).then((res) => alert("idk" + res)).catch((err) => alert("OH I KNOW" + err))
=======
            salary: this.state.salary,
        };

        axios.post("http://localhost:5000/staff/AddStaff", staff,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Staff added successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
>>>>>>> c949ea99c0cc39b8a7a2bcd99da72aa207113c17
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
                            <label for="name">Name</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="name" name="name" placeholder="Enter the name.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="email">Email</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="email" name="email" placeholder="Enter the email.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="officelocation">Office Location</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="officelocation" name="officelocation" placeholder="Enter the office location.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="gender">Gender</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="gender" name="gender" placeholder="Enter the Gender.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="department">Department</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="department" name="department" placeholder="Enter the Department.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="role">Academic Role</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="role" name="role" placeholder="Enter the role.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="dayoff">dayoff</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="dayoff" name="dayoff" placeholder="Enter the dayoff.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="salary">Salary</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="salary" name="salary" placeholder="Enter the Salary.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <input type="submit" value="Submit"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddStaff