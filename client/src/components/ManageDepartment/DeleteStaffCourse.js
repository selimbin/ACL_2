import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageDepartment.css'

export class DeleteStaffCourse extends Component {
    state = {
        id: '',
        code: ''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const course = {
            course: this.state.code,
            id: this.state.id
        }

        axios.post("http://localhost:5000/staff/removeInstructor", course,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Instructor removed Successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="ManageDepartment">
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
                            <label htmlfor="departmentname">Staff ID</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="id" name="id" placeholder="Enter Instructor to Remove from this course.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <input type="submit" value="Remove"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default DeleteStaffCourse