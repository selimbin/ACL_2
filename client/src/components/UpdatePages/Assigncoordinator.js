import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class Assigncoordinator extends Component {
    state = {
        course_code: '',
        staff_id : '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const Coordinator = {
            course_code: this.state.course_code,
            staff_id : this.state.staff_id ,
        };

        axios.put("http://localhost:5000/staff/Assigncoordinator", Coordinator,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Coordinator assigned successfully",{position: toast.POSITION.TOP_CENTER}))
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
                        <div class="col-25">
                            <label htmlfor="course_code">Course Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="course_code" name="course_code" placeholder="Enter the course code.." onChange={this.myChangeHandler}></input>
                        </div>
                        <div class="col-25">
                            <label htmlfor="staff_id">staff id</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="staff_id" name="staff_id" placeholder="Enter the staff id.." onChange={this.myChangeHandler}></input>
                        </div>
                </div>
                <div class="row">
                    <input type="submit" value="Assign"></input>
                </div>
                </form>
            </div>
        </div>
        )
    }
}

export default Assigncoordinator