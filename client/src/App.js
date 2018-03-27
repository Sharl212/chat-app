import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
// import logo from './logo.svg';

import moment from 'moment';

import { sendmsg } from './appForm.js';

import './appStructure.js';

// styling
import './App.css';
import './libs/Semantic-UI-CSS-master/semantic.css'
import '.././src/form.css';
import './libs/bootstrap/bootstrap.css';

const socket = socketIOClient("/"); // connect to the server


class App extends Component {

  constructor(){
    super();
    
    this.state = {
      messages:[]
    }
  }

  componentDidMount(){

     socket.on('newMessage', (message)=>{

      const formattedDate = moment(message.createdAt).format('hh:mm:ss A'); // format timestamp to {11:20 AM}

      this.setState(()=>{
        return {
          messages: this.state.messages.concat({from: message.from, content: message.content, createdAt:formattedDate}) // connect the old messages to the new one
        }
      })
    });
  }

  render() {
    let messages = this.state.messages; // contains whole message array

    return (
    <div className="container">
      <form onSubmit={sendmsg}>
        <div className="row">
            <div className="col-12">
                <div className="panel panel-primary">
                  <input type="text" name="from" className='form-control' placeholder='Nickname..' required autoComplete="off"/><br/>
                    <div className="panel-body">
                        <ul className="chat">
                            {messages.map((messages)=>{
                              let key = Math.floor(Math.random()*999)+1; // random number generator for each message element

                              return (
                                <li className="left clearfix" key={key}>
                                  <div className="chat-body clearfix">
                                      <div className="header">
                                          <strong className="primary-font">{messages.from}</strong> <small className="pull-right text-muted">
                                              <span className="glyphicon glyphicon-time"></span>{messages.createdAt}</small>
                                      </div><br/>
                                    <p>{messages.content}</p> 
                                </div>
                              </li>
                              )
                            })}
                        </ul>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <input id="btn-input" type="text" name='msgContent' className="form-control input-sm" placeholder="Type your message here..."  required autoComplete="off"/>
                            <span className="input-group-btn">
                                <button className="btn btn-warning btn-sm" id="btn-chat" type='submit'>
                                    Send</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </form>
    </div>

                  
    );
  }
}

export default App;
export { socket };