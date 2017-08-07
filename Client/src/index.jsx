import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Components/search.jsx';
import RoomList from './Components/roomlist.jsx';
import Rooms from './Components/rooms.jsx';
var $ = require('jquery');

class BookLogger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  booktitle: '', 
                  bookauthor: '',
                  formClick: false, 
                  allRooms: [],
                  selectOption: '',
                  done: '',
                  books: [],
                  showBooks: false
                  };
                
  this.handleBookSubmit = this.handleBookSubmit.bind(this);
  this.handleAuthor = this.handleAuthor.bind(this);
  this.handleBookName = this.handleBookName.bind(this);
  this.pullForm = this.pullForm.bind(this);
  this.sendInfoToServer = this.sendInfoToServer.bind(this);
  this.gettingAllRooms = this.gettingAllRooms.bind(this);
  this.changeSelectState = this.changeSelectState.bind(this);
  this.notOk = this.notOk.bind(this);
  this.beenClicked = this.beenClicked.bind(this);
  this.closeBooks = this.closeBooks.bind(this);
  }

  handleBookSubmit (event) {
    event.preventDefault();
    alert('Book: ' + this.state.booktitle + ' Author ' + this.state.bookauthor + ' Room ' + this.state.selectOption );
    this.setState({formClick: false});
    var roomName = this.state.selectOption;
    var author = this.state.bookauthor;
    var booktitle = this.state.booktitle;
    this.sendInfoToServer(roomName, author, booktitle);

  }
  handleAuthor (event) {
    this.setState({bookauthor: event.target.value});
    
  }
  handleBookName (event) {    
    this.setState({booktitle: event.target.value});
  }
  pullForm () {
    this.setState({formClick: true});
  }

  sendInfoToServer (roomName, author, booktitle) {
    $.ajax({
        type: "POST",
        url: '/add/book',
        data: JSON.stringify({roomName: roomName, author: author, booktitle: booktitle}),
        contentType: 'application/json', 
        success: (result) => {
          console.log('success');
        },
        failure: function(err) {
          if (err) {
            throw err;
          }
        }
      });
  }

  notOk () {
    this.setState({done: false});
  }
  closeBooks () {
    this.setState({showBooks: false});
  }

  gettingAllRooms (val) {
    this.setState({allRooms: this.state.allRooms.concat([val])});
  }

  changeSelectState (event) {
  
    event.preventDefault();
    this.setState({selectOption: event.target.value });
  }

  componentDidMount() {
    $.ajax({
        type: "GET",
        url: '/allrooms',
        
        success: (result) => {
          this.setState({done: true});
          this.setState({allRooms: result});
          
        },
        failure: function(err) {
          if (err) {
            throw err;
          }
        }
      });
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

  render() {
    var showbooks;
    if (this.state.showBooks) {
      showbooks = (<div className='allthebooks'><ul>{this.state.books.map((book, index) =>{
        return <li key={index}>Title: {book.booktitle} Author: {book.author}</li>
      })}</ul><button onClick={this.closeBooks}> click to close</button></div>)
    }

    var ok;

      if (this.state.done) {
        ok = (<div><ul>{this.state.allRooms.map((r, index) => {
          return <li key={index}>{r.room} <button value={r.room} onClick={this.beenClicked}> see books</button></li>
        })}</ul></div>)
      }
    var popup;
     if (this.state.formClick) {
      popup = ( <form onSubmit={this.handleBookSubmit}  >

          <label>
            Add Book:
            <input type="text" value={this.state.booktitle} onChange={this.handleBookName} />
            <input type="text"  value={this.state.bookauthor} onChange={this.handleAuthor} />
            <select value={this.state.selectOption} onChange={this.changeSelectState}>
            <option> please select a room</option>
            {this.state.allRooms.map((room, index) =>{
              return <option key={index} value={room.room}  >{room.room}</option>
            })}
            </select>
          </label> 
          <button type="submit" > add title then author!</button>      
        </form>)
    } else {
       
    }

    return(
      <div className='bookLogger'>
        <h2>BookLogger </h2>

        <div>
          <h4>Rooms</h4>
          {showbooks}
          {ok}
          <RoomList className='roomList' func={this.gettingAllRooms} takeout={this.notOk} />
          
       <div className='addBooks'> 
       <button onClick={this.pullForm}>
        Click to Add books!!  
      </button> 
        {popup}
      </div>
        <div>
        <Search className="search" />
        </div>
        </div>
      </div>
      )
  }

  }
 


 ReactDOM.render(
  <BookLogger />,document.getElementById('app'));