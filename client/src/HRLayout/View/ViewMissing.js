import React, { Component } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Viewmissing from "../../components/ViewPages/ViewMissing";

export class ViewMissing extends Component {
    render() {
        const role = sessionStorage.getItem('role')
        if(role=="HR"){
            return (
                <div>
                    <Navbar/>
                    <Viewmissing/>
                </div>
            )
        }
        else{
            window.location.href='/Login' ;
        }
    }
}

export default ViewMissing