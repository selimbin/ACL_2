import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddCourse extends Component {
    state = {
        departmentname: '',
        code: '',
        totalslots: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const course = {
            Departmentname: this.state.departmentname,
            Code: this.state.code,
            totalSlots: this.state.totalslots,
        };

        axios.post("http://localhost:5000/staff/AddCourse", course,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Course added successfully",{position: toast.POSITION.TOP_CENTER}))
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
                            <input type="text" id="code" name="code" placeholder="Enter the course code.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="departmentname">Department</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="departmentname" name="departmentname" placeholder="Enter this course's department.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="totalslots">Total Slots</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="totalslots" name="totalslots" placeholder="Enter the Total number of slots.." onChange={this.myChangeHandler}></input>
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

export default AddCourse