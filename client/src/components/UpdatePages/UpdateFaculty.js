import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class UpdateFaculty extends Component {
    state = {
        name: '',
        newname: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const faculty = {
            Name: this.state.name,
            newName: this.state.newname,
        };

        axios.put("http://localhost:5000/staff/UpdateFaculty", faculty,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ",
            }
        })
        .then((res) => toast.success("Faculty Updated successfully",{position: toast.POSITION.TOP_CENTER}))
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
                        <label htmlfor="name">Current Faculty name</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="name" name="name" placeholder="Enter the current faculty name.." onChange={this.myChangeHandler}></input>
                    </div>
                    <div class="col-10">
                        <label htmlfor="newname">new Faculty Name</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="newname" name="newname" placeholder="Enter the new name.." onChange={this.myChangeHandler}></input>
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

export default UpdateFaculty