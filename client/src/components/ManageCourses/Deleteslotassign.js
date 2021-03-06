import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePage.css'

let x = 0;
let array = [];
export class Deleteslotassign extends Component {
    state = {
        slot_no: 0,
        day:'',
        staff_id : '',
        courses : array
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const slot = {
            slot_no:this.state.slot_no,
            day:this.state.day,
            staff_id :this.state.staff_id,
            courses : array
        };

        axios.put("http://localhost:5000/staff/DeleteAssignslots", slot,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("slot assignment removed successfully",{position: toast.POSITION.TOP_CENTER}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }    

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    add_element=(event)=>{
        array[x] = document.getElementById("course").value;
        alert("Element: " + array[x] + " Added at index " + x);
        x++;
        document.getElementById("course").value = "";
     }
     
    render() {
        return (
            <div class="UpdatePage">
            <div class="container">
                <form onSubmit={this.mySubmitHandler}>
                <ToastContainer />
                <div class="row">
                        <div class="col-25">
                            <label htmlfor="staff_id">staff id</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="staff_id" name="staff_id" placeholder="Enter the course code.." onChange={this.myChangeHandler}></input>
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
                            <label htmlfor="name">course code</label>
                        </div>
                        <div class="col-25">
                        <input type="text" id="course" name="course" placeholder="Enter a course  code.." ></input>
                        <input type="button" id="course1" value="Add" onClick={this.add_element}></input>
                        </div>
                    </div>
                <div class="row">
                    <input type="submit" value="remove"></input>
                </div>
                </form>
            </div>
        </div>
        )
    }
}

export default Deleteslotassign