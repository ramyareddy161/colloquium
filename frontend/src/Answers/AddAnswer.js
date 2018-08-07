import React,{Component} from 'react'
import {withRouter} from 'react-router-dom';
import Cookies from 'universal-cookie';

class AddAnswer extends Component{ 
    cookies= new Cookies();
    state={
        isLoggedin:this.props.isLoggedin,
        url:'/forum/api/questions/',
        addanswer_url:'/addanswer/',
        description:null,
    }

    saveDescription=(event)=>{
        const {target:{value}}=event;
        this.setState({
            description:value
        });
    }

    submit = (e) =>{
        var data=JSON.stringify({
            description:this.state.description,
        });
        console.log(this.state.description);
        console.log(data);
        fetch(this.state.url+this.props.match.params.id+this.state.addanswer_url,{
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
            this.setState({
                status:true,
                description:null,
            });
            this.setState(prev=>({version:prev.version+1}));
            this.props.history.push('/forum/templateview/questions/'+this.props.match.params.id+'/');        
        })
        .catch(e => {console.log (e);});
    }

    render(){
        return(
            <div>
            <div class="container">
                <label for="description"><b> Description </b></label><br/>
                <textarea rows="20" cols="150" onChange={this.saveDescription} placeholder="Enter Description" name="desc" required/>
                <br/>
                <button type="submit" onClick={this.submit} className={"btn btn-primary"} value="add_answer">Add Answer</button>
            </div>
        </div>
        )
    }
}

export default withRouter(AddAnswer);