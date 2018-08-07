import React,{Component} from 'react';
import {Link} from "react-router-dom";
import Cookies from 'universal-cookie';


class Questions extends Component{
    cookies = new Cookies();
    constructor(){
    super();
    this.state={
        QuestionsList:[],
    }
    }   
    
    componentDidMount() {
        fetch('https://ramyareddy16.herokuapp.com/forum/api/questions/', {
                method: 'get', 
               
                }).then(function(response) {
                    return response.json();
                })
                .then((myJson) => {
                    this.setState(prev => ( {QuestionsList : myJson}));
                })
                .catch(e => {console.log("Error occured in fetching..")});
    }
    
    render(){
        return(
            <div>
                <div class = "topnav" align = "right">
                    <Link style={{padding:"0 10px"}} to={'/forum/templateview/addquestion'}>Add Question </Link>
                {this.props.isAuthenticated?<div></div>:
                    <Link style={{padding:"0 10px"}} to={'/forum/templateview/register'}>Register</Link>}
                {this.props.isAuthenticated?<div></div>:
                <Link style={{padding:"0 10px"}} to={'/forum/templateview/login'}>  Login  </Link> }
                </div>
                <h2> Questions List </h2>
                {
                    this.state.QuestionsList.map((currentObj) =>
                    <div class="card"  style={{border:"1px groove",width:"80%",position:'relative'}}>
                        <div class="container">
                        <h2><Link  to={'/forum/templateview/questions/'+currentObj.id +'/'}>{currentObj.title}</Link></h2>
                        <h5 style={{position:'absolute',bottom:'0',right:'10px'}}>
                        Asked By : {currentObj.user_profile.user.first_name}</h5>
                        </div>
                    </div>
                    )
                }
            </div>
        );
        }
    }

export default Questions;