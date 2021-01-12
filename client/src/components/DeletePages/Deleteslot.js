import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeletePage.css'

export class Deleteslot extends Component {
    state = {
        course_code: '',
        location: '',
        slot_no: 0,
        day:''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        axios.delete("http://localhost:5000/staff/deleteslot", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            },
            data: {
            course_code: this.state.course_code,
            location: this.state.location,
            slot_no:this.state.slot_no,
            day:this.state.day
            }
          })
        .then((res) => toast.success("slot Deleted successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="DeletePage">
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
                            <label htmlfor="slot_no">period</label>
                        </div>
                        <div class="col-75">
                            <input type="number" id="slot_no" name="slot_no" placeholder="Enter the period number .." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="day">Day</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="day" name="day" placeholder="Enter the day.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>  
                    <div class="row">
                        <input type="submit" value="Delete"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Deleteslot