import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'
import useToken from '../useToken.js';

let x = 0;
let array = [];

export class Viewcoverage extends Component {
    // const [token, setToken] = useState();
    
    state = {
        courses : array,
        coverage:[axios]
    }

    mySubmitHandler = async event => {
        event.preventDefault();

        const course = {
            courses:array
        }

        await axios.post("http://localhost:5000/staff/viewcoverage", course ,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then(res => this.setState({coverage:res.data}))
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
            <div class="ViewPage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
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
                        <input type="submit" value="Search"></input>
                    </div>
                    </form>
                </div>
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>coverage</th>
                    </tr>
                    {this.state.coverage.map((item) => {
                            return (
                                <tr>
                                    <td>{item}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default Viewcoverage