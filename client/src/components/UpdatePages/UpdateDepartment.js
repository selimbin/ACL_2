import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class UpdateDepartment extends Component {
    state = {
        facultyname: '',
        departmentname: '',
        newdepartmentname: '',
        newfacultyname: '',
        head: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const department = {
            FacultyName: this.state.facultyname,
            DepartmentName: this.state.departmentname,
            newDepartmentName: this.state.newdepartmentname,
            newFacultyname: this.state.newfacultyname,
            newHead: this.state.head,
        };

        axios.put("http://localhost:5000/staff/UpdateDepartment", department,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Department Updated successfully",{position: toast.POSITION.TOP_CENTER}))
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
                        <label htmlfor="facultyname">Current Faculty name</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="facultyname" name="facultyname" placeholder="Enter the current faculty name.." onChange={this.myChangeHandler}></input>
                    </div>
                    <div class="col-10">
                        <label htmlfor="DepartmentName">Current Department</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="DepartmentName" name="DepartmentName" placeholder="Enter the current department.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="newfacultyname">New Faculty name</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="newfacultyname" name="newfacultyname" placeholder="Enter the new faculty name.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="newdepartmentname">New Department name</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="newdepartmentname" name="newdepartmentname" placeholder="Enter the new department name.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="head">new Head of department</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="head" name="head" placeholder="Enter the new head of department.." onChange={this.myChangeHandler}></input>
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

export default UpdateDepartment