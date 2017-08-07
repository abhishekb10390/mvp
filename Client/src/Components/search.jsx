import React from 'react';
var $ = require('jquery');
  class Search extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        search: '',
        searcha: '',
        showBooks: false,
        outcome: []
      }
      this.searching = this.searching.bind(this);
      this.searchVal = this.searchVal.bind(this);
      this.searchAuth = this.searchAuth.bind(this);
      this.searchingAuthor = this.searchingAuthor.bind(this);
      this.closeTable = this.closeTable.bind(this);
    }

    searching (event) {
      event.preventDefault();
      var value = this.state.search;

      $.ajax({
      type: "POST",
      url: '/books/search',
      data: JSON.stringify({bookName: value}),
      contentType: 'application/json', 
      success: (result) => {
        var room = result[0].room;
        var author = result[0].author;
        this.setState({search: ''});
        alert(value + ' written by '+ author + ' found in ' + room);
        },
      failure: function(err) {
        if (err) {
          throw err;
        }
      }
    });
      
    }

    searchVal (event) {
      this.setState({search: event.target.value});
    }
    
    searchAuth (event) {
      this.setState({searcha: event.target.value});
    }

    searchingAuthor (event) {
      event.preventDefault();
      var value = this.state.searcha;

      $.ajax({
      type: "POST",
      url: '/author/search',
      data: JSON.stringify({authorName: value}),
      contentType: 'application/json', 
      success: (result) => {
        this.setState({outcome: this.state.outcome.concat(result)});
        this.setState({showBooks: true});
        this.setState({searcha: ''});
        },
      failure: function(err) {
        if (err) {
          throw err;
        }
      }
    });
      
    }
    closeTable () {
      this.setState({showBooks: false});
      this.setState({outcome: []});
    }

    render() {
      var showAll;
      if (this.state.showBooks) {
        
        showAll = (
          <div>
          <button onClick={this.closeTable} >Close table </button>
          <table> 
          <tbody>
           <tr>
          <th>Booktitle</th>
          <th colSpan="2">Room</th>
        </tr>
        {this.state.outcome.map((books, index)=>{
          return (
          <tr key={index}><td>{books.booktitle}</td><td>{books.room}</td></tr>
          )
        })}
        </tbody>
          </table>
          </div>
          )
      }
      return (

        <div>
        <div className="booksearch">
           <div >
              <input type="text"   placeholder="type to search books" value={this.state.search} onChange={this.searchVal}/>
              <button type="submit" onClick={this.searching} >
                <i >click to search books</i>
             </button>
           </div>
        </div>

        <div className="authorsearch" >
           <div >
              <input type="text" placeholder="type to search authors" value={this.state.searcha} onChange={this.searchAuth} />
              <button type="submit" onClick={this.searchingAuthor} >
                <i >click to search authors</i>
             </button>
           </div>
           {showAll}
        </div>
        </div>
        );
    }

  }

export default Search;