import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
// import logo from './logo.svg';

import moment from 'moment';

import { sendmsg } from './appForm.js';

import $ from 'jquery';
import './appStructure.js';
import emoji from 'node-emoji';
// styling
import './libs/Semantic-UI-CSS-master/semantic.css'
import '.././src/form.css';
import './libs/bootstrap/bootstrap.css';

const socket = socketIOClient("/"); // connect to the server

// const $ = jQuery.noConflict();

class App extends Component {

  constructor(){
    super();

    this.state = {
      messages:[],
      emoji:[],
      chosenEmoji: '',
    }
  }

  componentDidMount(){

     socket.on('newMessage', (message)=>{
        const formattedDate = moment(message.createdAt).format('hh:mm:ss A'); // format timestamp to {11:20 AM}
        const messageContent = message.content // the message content

        const emojis = {
          ':('    :  ':cry:',
          'pizza' :  ':pizza:',
          ':D'    :  ':smile:',
          ':d'    :  ':smile:',
          'coffee':  ':coffee:'
        }

        const doesInclude = (val) => messageContent.includes(val); // check if the emoji string is included in messageContent

        Object.entries(emojis).forEach( // loop through the object
          (value,key) =>{
              let UserEmoji = value[0]; // select the emoji
              if(doesInclude(UserEmoji)){
                // console.log(UserEmoji)
                this.setState({
                  emoji: UserEmoji, chosenEmoji: emoji.get(`${value[1]}`) // value[1] is the actual emoji format
              })
            }
          }
        )
        

        $(function() { // scroll down when a new message is recieved.
          const chatPanel = $('.panel-body');
          const scrollDown = () =>{
            chatPanel.scrollTop(chatPanel.prop('scrollHeight'));
          }
          scrollDown();
        });
      
        this.setState(()=>{
          return {
            messages: this.state.messages.concat({from: message.from, content: message.content.replace(this.state.emoji, this.state.chosenEmoji), createdAt: formattedDate}), // connect the old messages to the new one
            emoji: [],
            chosenEmoji: ''
          }
        });
    });


  }

  render() {
    let messages = this.state.messages; // contains whole message array
     const myFunction = () => {
          var popup = document.getElementById("myPopup");
          popup.classList.toggle("show");
      }

      const searchEmoji = (() =>{
          let emo = emoji.search(`:${$('#input').val()}:`).emoji;
          console.log(emo);
          $('#myPopup').text(emo);
          myFunction();
      });

    return (
    <div className="container">
      <form onSubmit={sendmsg}>
        <div className="row">
            <div className="col-12">
                <div className="panel panel-primary">
                  <input type="text" name="from" className='form-control' placeholder='Nickname..' required autoFocus autoComplete="off"/><br/>
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
                                    <p>{messages.content}{this.state.emoji}</p>
                                </div>
                              </li>
                              )
                            })}
                        </ul>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <input id="input" type="text" name='msgContent' className="form-control input-sm" placeholder="Type your message here..." required autoComplete="off" />
                            <span className="input-group-btn">
                                <button className="btn btn-warning btn-sm" id="btn-chat" type='submit'>
                                    Send</button>
                            </span>
                            {/* <span className="input-group-btn popup">
                            <div type='button' className="btn btn-success" onClick={searchEmoji}>
                                <h3>Emoji</h3>
                              </div>
                              <span className="popuptext" id="myPopup"></span>
                            </span> */}
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
