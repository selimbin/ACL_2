import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddPage.css'

export class AddchangeDayOffReq extends Component {
    state = {
        id: '',
        newdayoff:'',
        reason:''
    };

    mySubmitHandler = event => {
        event.preventDefault();

        const request = {
            id: this.state.id,
            newdayoff:this.state.newdayoff,
            reason:this.state.reason
        };

        axios.post("http://localhost:5000/staff/changeDayOffReq", request,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then((res) => toast.success("Request added successfully",{position: toast.POSITION.TOP_CENTER}))
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
                            <label htmlfor="newdayoff">newdayoff</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="newdayoff" name="newdayoff" placeholder="Enter the requested new day off.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="reason">reason</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="reason" name="reason" placeholder="Enter the reason for the request.." onChange={this.myChangeHandler}></input>
                        </div>
                    </div>  
                    <div class="row">
                        <input type="submit" value="Send Request"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddchangeDayOffReq