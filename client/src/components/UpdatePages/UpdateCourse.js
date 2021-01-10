import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class UpdateCourse extends Component {
    state = {
        departmentname: '',
        code: '',
        newdepartmentname: '',
        newcode: '',
        totalslots: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const course = {
            Departmentname: this.state.departmentname,
            Code: this.state.code,
            newDepartmentname: this.state.newdepartmentname,
            newCode: this.state.newcode,
            totalslots: this.state.totalslots,
        };

        axios.put("http://localhost:5000/staff/UpdateCourse", course,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Course Updated successfully",{position: toast.POSITION.TOP_CENTER}))
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
                        <label htmlfor="code">Current Course Code</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="code" name="code" placeholder="Enter the current course code.." onChange={this.myChangeHandler}></input>
                    </div>
                    <div class="col-10">
                        <label htmlfor="departmentname">Current Department</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="departmentname" name="departmentname" placeholder="Enter the current department.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="newcode">New Course Code</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="newcode" name="newcode" placeholder="Enter the new course code.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="newdepartmentname">New Department</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="newdepartmentname" name="newdepartmentname" placeholder="Enter this course's new department.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="totalslots">new Total Slots</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="totalslots" name="totalslots" placeholder="Enter the Total number of slots.." onChange={this.myChangeHandler}></input>
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

export default UpdateCourse