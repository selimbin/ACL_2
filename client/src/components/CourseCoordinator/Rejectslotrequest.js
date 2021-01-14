import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class Rejectslotrequest extends Component {
    state = {
        course_code: '',
        slotlinking_id: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const request = {
            course_code: this.state.course_code,
            slotlinking_id: this.state.slotlinking_id,
        };

        axios.put("http://localhost:5000/staff/Rejectslotlinkingreq", request,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Request rejected successfully",{position: toast.POSITION.TOP_CENTER}))
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
                            <label htmlfor="slotlinking_id">Request _id</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="slotlinking_id" name="slotlinking_id" placeholder="Enter the exact request _id.." onChange={this.myChangeHandler}></input>
                        </div>
                </div>
                <div class="row">
                    <input type="submit" value="Reject"></input>
                </div>
                </form>
            </div>
        </div>
        )
    }
}

export default Rejectslotrequest
