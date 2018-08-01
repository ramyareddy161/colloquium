import React, { Component } from 'react';
import './App.css';
import {Header,Heading} from './Header'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { HashRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Login from './Authentication/Login';
import Questions from './Questions';
import Register from './Register';
import Answers from './Answers';
import AddQuestion from './Questions/AddQuestion';


class App extends Component {
  state = {
    title : "Questions",
    isAuthenticated : false,
    username:'',
    token:null,
  }
  cookies = new Cookies();

  constructor(){
    super();
    if (this.cookies.get('userJwtToken') != '')
    {
      this.updateLoginStatus(true);
    }
  }
  
  updateTitle = (title) => {
    this.setState({title});
  }
  
  updateLoginStatus = (isAuthenticated) => {
    this.setState({isAuthenticated})
  }

  updateUsername = (username) => {
    this.setState({username})
  }

  updateToken = (token) =>{
    this.setState({token});
  } 

  updateUserId = (id) =>{
    this.setState({id});
  }


  componentWillMount(){
    let token = this.cookies.get('discussion_jwt_token');
    console.log(token);
    if (!(typeof token === 'undefined'))
    {
        let username=this.cookies.get('discussion_username');
        let id=this.cookies.get('discussion_user_id');
        this.updateUsername(username);
        this.updateUserId(id);
        this.updateToken(token);
    }
 }

  render() {
    return (
      <div align = "center">
        <Header title="COLLOQUIUM" isAuthenticated={this.state.isAuthenticated}
         username={this.state.username} updateUsername={this.updateUsername} 
         updateStatus={this.updateLoginStatus}/>
        <Router>
          <Switch>
              <Route exact path="/forum" render = {(props)=>
               <Questions 
                  isAuthenticated={this.state.isAuthenticated}
                  updateHeading={this.updateTitle}
                />}/>
              <Route exact path="/forum/login" render={(props) => this.state.isAuthenticated? 
              <Redirect to="/"/>:
                <Login 
                isAuthenticated={this.state.isAuthenticated}
                username={this.state.username} updateUsername={this.updateUsername} 
                updateStatus={this.updateLoginStatus}/>
                }
              />
              <Route exact path = "/forum/register" component={Register} />
              <Route exact path="/forum/questions/:id" render={(props) =>
                 <Answers {...props} updateHeading={this.updateTitle} />}/>
              <Route exact path="/forum/addquestion" render={props => this.state.isAuthenticated
               ? <AddQuestion token={this.state.token} isLoggedIn={this.state.isAuthenticated}/>
               :<Redirect to="/forum/login" />}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;