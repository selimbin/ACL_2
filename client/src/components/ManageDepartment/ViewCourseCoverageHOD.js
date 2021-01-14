import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'

export class ViewCourseCoverageHOD extends Component {
    state = {staff:[
        axios 
    ]}

    componentDidMount(){
        axios.get("http://localhost:5000/staff/viewCourseCoverage",{
            headers:
            {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/JSON",
                "token":sessionStorage.getItem('token')
            }
        }).then(
          res =>this.setState({staff:res.data}),toast.warning("Loading might take some time",{position: toast.POSITION.TOP_CENTER}))
    }
    render() {
        return (
            <div class="ViewPage">
                <table id="customers">
                <ToastContainer />
                    <tr>
                        <th>Course Code</th>
                        <th>Course Coverage</th>
                    </tr>
                    {this.state.staff.map((item) => {
                            return (
                                <tr>
                                    <td>{item.code}</td>
                                    <td>{item.coverage}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default ViewCourseCoverageHOD