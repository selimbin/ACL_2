import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageDepartment.css'

export class RejectRequests extends Component {
    state = {
        id: '',
        response:''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const course = {
            _id: this.state.code,
            response:this.state.response
        }

        axios.post("http://localhost:5000/staff/rejectRequest", course,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Request Successfully Rejected",{position: toast.POSITION.TOP_CENTER}))
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
                            <label htmlfor="code">Request _id</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="code" name="code" placeholder="Enter exact request _id" onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="id">Response (optional)</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="response" name="response" placeholder="Enter your response .." onChange={this.myChangeHandler}></input>
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

export default RejectRequests