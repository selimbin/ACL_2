import React, { Component } from 'react'
import './AddPage.css'

export class AddDepartment extends Component {
    render() {
        return (
            <div class="AddPage">
                <div class="container">
                    <form action="/action_page.php">
                    <div class="row">
                        <div class="col-25">
                            <label for="facultyname">Faculty name</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="facultyname" name="facultyname" placeholder="Enter this department's faculty.."></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="name">Department name</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="name" name="name" placeholder="Enter the name.."></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="head">Head of department</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="head" name="head" placeholder="Enter the HOD id.."></input>
                        </div>
                    </div> 
                    <div class="row">
                        <input type="submit" value="Submit"></input>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddDepartment