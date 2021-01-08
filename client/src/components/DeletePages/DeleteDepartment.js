import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeletePage.css'

export class DeleteDepartment extends Component {
    state = {
        facultyname: '',
        DepartmentName: ''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        axios.delete("http://localhost:5000/staff/DeleteDepartment", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ"
            },
            data: {
                FacultyName: this.state.facultyname,
                Name: this.state.DepartmentName
            }
          })
        .then((res) => toast.success("Department Deleted successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="DeletePage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="facultyname">Faculty name</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="facultyname" name="facultyname" placeholder="Enter this department's faculty.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="DepartmentName">Department name</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="DepartmentName" name="DepartmentName" placeholder="Enter the Department name.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" value="Delete"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default DeleteDepartment