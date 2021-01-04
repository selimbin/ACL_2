import React, { Component } from 'react';
import './AddPage.css'

export class AddFaculty extends Component {
    render() {
        return (
            <div class="AddPage">
                <div class="container">
                    <form action="/action_page.php">
                    <div class="row">
                        <div class="col-25">
                            <label for="name">Faculty name</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="name" name="name" placeholder="Enter the name.."></input>
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

export default AddFaculty