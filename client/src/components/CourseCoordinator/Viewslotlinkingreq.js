import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'

export class Viewslotlinkingreq extends Component {
    // const [token, setToken] = useState();
    
    state = {
        course_code:'',
        requests:[axios]
    }

    mySubmitHandler = async event => {
        event.preventDefault();

        const course = {
            course_code:this.state.course_code
        }

        await axios.post("http://localhost:5000/staff/viewslotlinkingreq", course ,{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        })
        .then(res => this.setState({requests:res.data}))
        .catch((err) => toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER}))
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    render() {
        return (
            <div class="ViewPage">
                <div class="container">
                    <form onSubmit={this.mySubmitHandler}>
                    <ToastContainer />
                    <div class="row">
                        <div class="col-25">
                            <label htmlfor="course_code">Course Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="course_code" name="course_code" placeholder="Enter Course code.." onChange={this.myChangeHandler}></input>
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
                        <th>id</th>
                        <th>status</th>
                        <th>requester</th>
                        <th>slot</th>
                        <th>day</th>
                    </tr>
                    {this.state.requests.map((item) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.status}</td>
                                    <td>{item.requester}</td>
                                    <td>{item.slot}</td>
                                    <td>{item.newDay}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default Viewslotlinkingreq