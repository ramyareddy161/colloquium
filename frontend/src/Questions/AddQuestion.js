import React,{Component} from 'react'
import {withRouter} from 'react-router-dom';
import Cookies from 'universal-cookie';

class AddQuestion extends Component{ 
    cookies= new Cookies();
    state={
        isLoggedin:this.props.isLoggedin,
        token:this.props.token,
        askquestion_url:'https://ramyareddy16.herokuapp.com/forum/api/questions/addquestion/',
        title:null,
        description:null,
    }

    saveTitle=(event)=>{
        const {target:{value}}=event;
        this.setState({
            title:value
        });
    }

    saveDescription=(event)=>{
        const {target:{value}}=event;
        this.setState({
            description:value
        });
    }

    submit = (e) =>{
        var title=this.state.title;
        var description=this.state.description;
        var data=JSON.stringify({
            title:title,
            description:description,
        })
        console.log(data.title);
        console.log(data.description);
        console.log(data);
        console.log(this.state.askquestion_url);
        fetch(this.state.askquestion_url,{
            method:'POST',
            headers: new Headers({
             'Authorization': 'JWT '+ this.cookies.get('userJwtToken').token, 
             'Content-Type': 'application/json',
             'Accept': 'application/json',
                    }),
            body:data,
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
            this.props.history.push('/forum/templateview/');
        })
        .catch(e => {console.log (e);});
    }

    render(){
        return(
            <div>
            <div class="container">
                <label for="title"><b> Title </b></label>
                <input type="text" onChange={this.saveTitle} placeholder="Enter Title" name="title" required/>
                <br/>
                <label for="description"><b> Description </b></label>
                <textarea rows="20" cols="150" onChange={this.saveDescription} placeholder="Enter Description" name="desc" required/>
                <br/>
                <button type="submit" onClick={this.submit} className={"btn btn-primary"} value="add_question">Add Question</button>
            </div>
        </div>
        )
    }
}

export default withRouter(AddQuestion);