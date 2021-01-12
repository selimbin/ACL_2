import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddDepartment extends Component {
    state = {
        facultyname: '',
        departmentname: '',
        head: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const department = {
            FacultyName: this.state.facultyname,
            DepartmentName: this.state.departmentname,
            Head: this.state.head,
        };

        axios.post("http://localhost:5000/staff/AddDepartment", department,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Department added successfully",{position: toast.POSITION.TOP_CENTER}))
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
                            <input type="text" id="DepartmentName" name="DepartmentName" placeholder="Enter the name.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="head">Head of department</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="head" name="head" placeholder="Enter the HOD id.." onChange={this.myChangeHandler}></input>
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

export default AddDepartment