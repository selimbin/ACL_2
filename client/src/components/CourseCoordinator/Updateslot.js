import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

export class Updateslot extends Component {
    state = {
        course_code: '',
        location: '',
        newlocation: '',
        newtype: '',
        slot_no: 0,
        day:'',
        compensation: false
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const slot = {
            course_code: this.state.course_code,
            location: this.state.location,
            newlocation: this.state.newlocation,
            newtype: this.state.newtype,
            slot_no:this.state.slot_no,
            day:this.state.day,
            compensation:this.state.compensation
        };

        axios.put("http://localhost:5000/staff/updateslot", slot,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("slot Updated successfully",{position: toast.POSITION.TOP_CENTER}))
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
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="location">location Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="location" name="location" placeholder="Enter the location code.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="newlocation">newlocation Code (optional)</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="newlocation" name="newlocation" placeholder="Enter the location code (optional).." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="newtype">newtype (optional)</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="newtype" name="newtype" placeholder="Enter the type(tut or lab)(optional).." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="slot_no">period</label>
                        </div>
                        <div class="col-25">
                            <input type="number" id="slot_no" name="slot_no" placeholder="Enter the period number .." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="day">Day</label>
                        </div>
                        <div class="col-25">
                            <input type="text" id="day" name="day" placeholder="Enter the day.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>    
                    <div class="row">
                        <div class="col-25">
                            <input type="checkbox" id="compensation" name="compensation" value="true" onChange={this.myChangeHandler}></input>
                            <label htmlfor="compensation">compensation (optional)</label>
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

export default Updateslot