import React, { Component } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeletePage.css'

export class DeleteLocation extends Component {
    state = {
        code: '',
    };

    mySubmitHandler = event => {
        event.preventDefault();

        axios.delete("http://localhost:5000/staff/DeleteLocation", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmUxMGU2MGU5MmM1OTI2MDg0OWEwZmYiLCJyb2xlIjoiSFIiLCJpYXQiOjE2MDg5MDQzMzl9.z0kUii0CzU6fDnjxPiD9SVoDe8WL1GVme2O0sK1jiJQ"
            },
            data: {
                Code: this.state.code
            }
          })
        .then((res) => toast.success("Location Deleted successfully",{position: toast.POSITION.TOP_CENTER}))
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
                            <label htmlfor="code">Location Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="code" name="code" placeholder="Enter the Location code.." onChange={this.myChangeHandler}></input>
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

export default DeleteLocation