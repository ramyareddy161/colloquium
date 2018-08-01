import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import AddAnswer from './AddAnswer';

class Answers extends Component{
    state={
        isAuthenticated:this.props.isAuthenticated,
        answersList:[],
        questionsList:[],
        question_title : "",
        question_description : "",
        first_name :"",
    }

    componentDidMount(){
        fetch('http://localhost:8000/forum/api/questions/'+this.props.match.params.id+'/')
        .then(response => response.json())
        .then(responseJson => {
            this.setState({answersList:responseJson});
        })
        .catch (e => {
            console.log(e);
            console.log("Error occured in second catch");
        });
        fetch('http://127.0.0.1:8000/forum/api/questions/', { 
                method: 'get', 
                }).then(function(response) {
                    return response.json();
                })
                .then((myJson) => {
                    this.setState(prev => ( {questionsList: myJson}));
                    console.log(this.state.questionsList);
                    this.setState({
                        question_title:this.state.questionsList[(this.props.match.params.id)-1].title,            
                        question_description:this.state.questionsList[(this.props.match.params.id)-1].description,
                        first_name:this.state.questionsList[(this.props.match.params.id)-1].user_profile.user.first_name,
                    });
                })
                .catch(e => {console.log("Error occured in fetching..")});
    }

    render(){
        return(
            <div align="left">
                <div style={{position:'relative',}}>
                <h1>{this.state.question_title}</h1>
                <hr/>
                <p> {this.state.question_description} <br/> </p>
                <h5 style={{position:'absolute',bottom:'0',right:'10px'}}>
                        Asked By : {this.state.first_name}</h5>
                <br/><br/></div><br/>
                <strong>Answer</strong> <hr/>
                {this.state.answersList.map((current)=>
                <div>
                    <div style={{position:'relative',}}>
                    <p> {current.description} <br/> </p>
                    <h5 style={{position:'absolute',bottom:'0',right:'10px'}}>
                        Answered By : {current.user_profile.user.first_name}</h5>
                    <br/><br/></div><br/>
                    <strong>Answer</strong> <hr/>
                </div>
                )}
                <AddAnswer isLoggedIn={this.state.isAuthenticated}/>
                }
            </div>
        );
        }
    }

export default Answers;
