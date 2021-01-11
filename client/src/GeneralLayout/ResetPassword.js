import React, { Component } from 'react'
import Navbar from "../components/Navbar/Navbar";
import Resetpassword from "../components/Services/ResetPassword";

export class ResetPassword extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Resetpassword/>
            </div>
        )
    }
}

export default ResetPassword