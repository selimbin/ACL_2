import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddLocation extends Component {
    state = {
        code: '',
        building: '',
        type: '',
        capacity: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const location = {
            Code: this.state.code,
            Building: this.state.building,
            Type: this.state.type,
            Capacity: this.state.capacity,
        };

        axios.post("http://localhost:5000/staff/AddLocation", location,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Location added successfully",{position: toast.POSITION.TOP_CENTER}))
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
                            <label htmlfor="code">Location Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="code" name="code" placeholder="Enter the code.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="building">Location's Building</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="building" name="building" placeholder="Enter the Building name.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="type">Location Type</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="type" name="type" placeholder="Enter the Type.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="capacity">Capacity</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="capacity" name="capacity" placeholder="Enter the Capacity.." onChange={this.myChangeHandler}></input>
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

export default AddLocation