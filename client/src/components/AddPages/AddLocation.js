import React, { Component } from 'react'
import './AddPage.css'

export class AddLocation extends Component {
    render() {
        return (
            <div class="AddPage">
                <div class="container">
                    <form action="/action_page.php">
                    <div class="row">
                        <div class="col-25">
                            <label for="code">Location Code</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="code" name="code" placeholder="Enter the code.."></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="building">Location's Building</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="building" name="building" placeholder="Enter the Building name.."></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="type">Location Type</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="type" name="type" placeholder="Enter the Type.."></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="capacity">Capacity</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="capacity" name="capacity" placeholder="Enter the Capacity.."></input>
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

export default AddLocation