import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class UpdateLocation extends Component {
    state = {
        code: '',
        newcode: '',
        building: '',
        type: '',
        capacity: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const location = {
            Code: this.state.code,
            newCode: this.state.newcode,
            Building: this.state.building,
            Type: this.state.type,
            Capacity: this.state.capacity,
        };

        axios.put("http://localhost:5000/staff/UpdateLocation", location,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Location Updated successfully",{position: toast.POSITION.TOP_CENTER}))
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
                        <label htmlfor="code">Current Location code</label>
                    </div>
                    <div class="col-15">
                        <input type="text" id="code" name="code" placeholder="Enter the current location code.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="newcode">New Code</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="newcode" name="newcode" placeholder="Enter the new location code.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="building">Building</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="building" name="building" placeholder="Enter the new building.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="type">Type</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="type" name="type" placeholder="Enter the new type.." onChange={this.myChangeHandler}></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label htmlfor="capacity">Capacity</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="capacity" name="capacity" placeholder="Enter the new Capacity.." onChange={this.myChangeHandler}></input>
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

export default UpdateLocation