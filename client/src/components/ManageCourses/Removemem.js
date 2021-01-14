import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeletePage.css'

let x = 0;
let array = [];

export class Removemem extends Component {
    state = {
        staff_id : '',
        courses : array
    };


    mySubmitHandler = event => {
        event.preventDefault();

        axios.delete("http://localhost:5000/staff/removecoursemem", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            },
            data: {
                staff_id: this.state.name ,
                courses:array
            }
          })
        .then((res) => toast.success("member removed successfully",{position: toast.POSITION.TOP_CENTER}))
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
            <div class="DeletePage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="staff_id">staff id</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="staff_id" name="staff_id" placeholder="Enter the staff  id.." onChange={this.myChangeHandler}></input>
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
                        <input type="submit" value="Remove"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Removemem