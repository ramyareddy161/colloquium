import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router'

class Register extends Component{
    constructor(props) {
        super(props);
    }
    cookies = new Cookies();
    state = {
        auth_url : '/api-basictoken-auth/',
        jwt_url : '/api-jwttoken-auth/',
        buttonName : 'Register',
        first_name : "",
        last_name : "",
        username : "" ,
        password: "",
        location: "",
    };
    
    saveFirst_name = (event) => {
        const {target : {value}}  = event;
        this.setState({
            first_name : value
        })
    }

    saveLast_name = (event) => {
        const {target : {value}}  = event;
        this.setState({
            last_name : value
        })
    }

    saveUsername = (event) => {
        const {target : {value}}  = event;
        this.setState({
            username : value
        })
    }

    savePassword = (event) => {
        const {target : {value}} = event;
        this.setState({
            password : value

        })
    }

    saveLocation = (event) => {
        const {target : {value}}  = event;
        this.setState({
            location : value
        })
    }

    submit = (e) =>{
        var data=JSON.stringify({
            user : {
                username: this.state.username,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                password: this.state.password,
            },
                location: this.state.location,
        });
        fetch('/forum/api/auth/register/',{
            method:'POST',
            headers: new Headers({
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
               }),
            body: data,
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    console.log(response.statusText);
                    alert(error,response.statusText);
                    throw error
                  }    
            })
        .then(responseJson => {
            // this.setState({
            //     status:true
            // });
            this.props.history.push('/forum/templateview/login/');
        })
        .catch(e => {console.log (e);});
        }

    
    render(){
        return (
            <div>
                <form class = "modal-content animate"><br/>
                <label for="first_name"><b> First_Name </b></label>
                <input onChange={this.saveFirst_name} type="text" placeholder="Enter first_name"/><br/>
                <label for="last_name"><b> Last_Name </b></label>
                <input onChange={this.saveLast_name} type="text" placeholder="Enter last_name"/><br/>
                <label for="username"><b> UserName </b></label>
                <input onChange={this.saveUsername} type="text" placeholder="Enter username"/><br/>
                <label for="password"><b> Password </b></label>
                <input onChange={this.savePassword} type="password" placeholder="Enter Password"/><br/>
                <label for="location"><b> Location </b></label>
                <input onChange={this.saveLocation} type="text" placeholder="Enter Location"/><br/>
                <button onClick={this.submit} className={"btn btn-primary"} value="Register">Register</button>
                </form>
            </div>
        )
    }
}

export default withRouter(Register)