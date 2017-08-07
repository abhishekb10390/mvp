import React from 'react';
//import Rooms from './rooms.jsx';
var $ = require('jquery');


class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: [], 
      roomName: '',
      nextOne: false,
      books: [],
      showBooks: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.addToList = this.addToList.bind(this);
    this.makeFieldEmpty = this.makeFieldEmpty.bind(this);
    this.goBackToMain = this.goBackToMain.bind(this);
    this.beenClicked = this.beenClicked.bind(this);
    this.goToRooms = this.goToRooms.bind(this);
    this.closeBooks = this.closeBooks.bind(this);
  }

  handleSubmit (event) {
    // if (this.state.roomList.includes(this.state.roomName)) {
    //   return;  
    // }

    //alert('You have added room: ' + this.state.roomName);
    event.preventDefault();
  }

  addRoom (event) {
    // if (this.state.roomList.includes(this.state.roomName)) {
    //   return;  
    // }
    this.setState({roomName: event.target.value});
  }
  makeFieldEmpty() {
    this.setState({roomName: ''});
  }

  addToList () {
    if (this.state.roomList.includes(this.state.roomName)) {
      alert('room exists!');
      this.makeFieldEmpty();
      return;  
    }
    // this.setState({roomList: this.state.roomList.concat([this.state.roomName])});
    // this.props.func(this.state.roomName);
    var roomName = this.state.roomName;
    this.props.func(this.state.roomName);
    $.ajax({
      type: "POST",
      url: '/add/room',
      data: JSON.stringify({roomName: roomName}),
      contentType: 'application/json', 
      success: (result) => {
        var list = result.map(function(r){
          return r.room;
        });
        alert('You have added room: ' + this.state.roomName);
        this.setState({roomList: list});
        //this.setState({roomList: this.state.roomList.concat([this.state.roomName])});
        this.props.takeout();
        this.makeFieldEmpty();
        
      },
      failure: function(err) {
        if (err) {
          throw err;
        }
      }
    });
  }
  closeBooks () {
    this.setState({showBooks: false});
  }

  handleClick(event) {
    var temp = event.target.text; // temp = Kitchen
    // query to server
    // server will look for temp kitchen shelf and
  }

  beenClicked(event) {
    var value = event.target.value;
    $.ajax({
      type: "POST",
      url: '/room/books/show',
      data: JSON.stringify({roomName: value}),
      contentType: 'application/json', 
      success: (result) => {
        this.setState({books: result})
        this.setState({showBooks: true});

        },
      failure: function(err) {
        if (err) {
          throw err;
        }
      }
    });
  }

  goBackToMain(event) {
    
    this.setState({nextOne: false});
  }

  goToRooms (val) {
    this.setState({nextOne: true});
    if(this.state.nextOne) {
      
    }
  }

  render() {
    
    var showbooks;
    if (this.state.showBooks) {
      showbooks = (<div className='allthebooks'><ul>{this.state.books.map((book, index) =>{
        return <li key={index}>Title: {book.booktitle} Author: {book.author}</li>
      })}</ul><button onClick={this.closeBooks}> click to close</button></div>)
    }

    return (
      <div>
      {showbooks}
      <ul>
      {this.state.roomList.map((room, index) => {
        return <li key={index} id={room} > {room} <button value={room} onClick={this.beenClicked}> see books</button></li>
      })}  
      </ul>

      <form onSubmit={this.handleSubmit} >
        <label>
          Add room:
          <input type="text" value={this.state.roomName} onChange={this.addRoom} />
        </label> 
        <input type="submit" value="Add room" onClick={this.addToList} />
      </form>
      </div>
    )
    }
}


export default RoomList;
