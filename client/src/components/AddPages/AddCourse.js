import React, { Component } from 'react'
import './AddPage.css'

export class AddCourse extends Component {
    render() {
        return (
            <div class="AddPage">
                <div class="container">
                    <form action="/action_page.php">
                    <div class="row">
                        <div class="col-25">
                            <label for="code">Course Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="code" name="code" placeholder="Enter the course code.."></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="department">Department</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="department" name="department" placeholder="Enter this course's department.."></input>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-25">
                            <label for="slots">Total Slots</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="slots" name="slots" placeholder="Enter the Total number of slots.."></input>
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

export default AddCourse