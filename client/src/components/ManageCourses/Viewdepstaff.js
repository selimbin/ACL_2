import React, { Component } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPage.css'
import useToken from '../useToken.js';

export class Viewdepstaff extends Component {
    // const [token, setToken] = useState();
    
    state = {
        staff:[
        axios 
    ]}

    componentDidMount(){
        axios.get("http://localhost:5000/staff/viewdepstaff",{
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
                        <th>id</th>
                        <th>name</th>
                        <th>gender</th>
                        <th>email</th>
                        <th>role</th>
                        <th>salary</th>
                        <th>dayOff</th>
                        <th>course</th>
                        <th>officeLocation</th>
                    </tr>
                    {this.state.staff.map((item) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>{item.salary}</td>
                                    <td>{item.dayOff}</td>
                                    <td>{item.course}</td>
                                    <td>{item.officeLocation}</td>
                                </tr>
                            )
                        })}
                </table>
            </div>
        )
    }
}

export default Viewdepstaff