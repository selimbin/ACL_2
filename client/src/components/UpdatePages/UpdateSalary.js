import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class UpdateSalary extends Component {
    state = {
        id: '',
        promotion: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const salary = {
            id: this.state.id,
            promotion: this.state.promotion,
        };

        axios.put("http://localhost:5000/staff/UpdateSalary", salary,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Salary Updated successfully",{position: toast.POSITION.TOP_CENTER}))
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
                        <label htmlfor="id">Current The staff ID</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="id" name="id" placeholder="Enter the Staff's id.." onChange={this.myChangeHandler}></input>
                    </div>
                    <div class="col-10">
                        <label htmlfor="promotion">Promotion (if Exists)</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="promotion" name="promotion" placeholder="Enter the promotion.." onChange={this.myChangeHandler}></input>
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

export default UpdateSalary