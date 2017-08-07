var $ = require('jquery');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var mysql = require('mysql');
var db = require('../Database/index');
var util = require('util');



app.use(express.static('/Users/abhishekbala/Documents/hrMVP/Client/dist'));
app.use(bodyParser.json()) ;

app.listen(3000, function(){
  console.log('server connected!');
});

app.get('/allrooms', function(req, res){
  db.query('SELECT room FROM rooms', function(err, results){
    res.send(results);
  });
});


app.post('/add/room', function(req, res){

  var roomname = req.body.roomName;
  var queryStr = util.format('INSERT INTO rooms (room) VALUES ("%s")', roomname); 
  var searchStr = util.format('SELECT id FROM rooms WHERE room ="%s"', roomname);

  db.query(searchStr, function(err, results) {

    if(err) {
      throw err;
    }
    if (results.length !== 0) {
      db.query('SELECT room FROM rooms', function(err, results){
        res.send(results);
      });
    } else {
      db.query(queryStr, function(err, results){

        db.query('SELECT room FROM rooms', function(err, results){
          res.send(results);
        });
      });
    }
  });
 // res.send()
});

app.post('/add/book', function(req, res){

  var roomname = req.body.roomName;
  var author = req.body.author;
  var booktitle = req.body.booktitle;
  var roomid;
  var authorid;
  var insertAuthor = util.format('INSERT INTO authors (author) VALUES ("%s")', author);
  var roomCond = util.format('SELECT rooms.id FROM rooms WHERE rooms.name = "%s"', roomname);
  
  var checkAuth = util.format('SELECT authors.id FROM authors WHERE authors.author = "%s"', author);
  var getRoomId = util.format('SELECT rooms.id FROM rooms WHERE rooms.room = "%s"', roomname);
  var checkBook = util.format('SELECT books.id FROM books WHERE books.booktitle = "%s"', booktitle);

  db.query(getRoomId, function(err, results){
    roomid = results[0].id;
    db.query(checkAuth, function(err, results){
      if(results.length === 0) {
        //need to insert new author
        db.query(insertAuthor, function(err, results) {
          authorid = results.insertId;
          db.query(checkBook, function(err, results){
            if (results.length === 0) {
              var insertBook = util.format('INSERT INTO books (booktitle, authorid, roomid) VALUES ("%s", %d, %d)', booktitle, authorid, roomid);
              db.query(insertBook, function(err, results){
                var claimBook = results.insertId;
                db.query('SELECT books.booktitle FROM books WHERE books')
                res.send();
              });
            } else {
              res.send();
            }
          });
        });
      } else {
        //no need to insert new author
        authorid = results.insertId;
        db.query(checkBook, function(err, results){
          if (results.length === 0) {
            var insertBook = util.format('INSERT INTO books (booktitle, authorid, roomid) VALUES ("%s", %d, %d)', booktitle, authorid, roomid);
            db.query(insertBook, function(err, results){
              res.send();
            });
          } else {
              res.send();
            }
        });
      }
    });
    });
  });

  app.post('/room/books/show', function(req, res){
    var roomname = req.body.roomName;
    var roomid = util.format('SELECT rooms.id FROM rooms WHERE rooms.room = "%s"', roomname)
    var findbooks = util.format('select books.booktitle, authors.author from ((books inner join rooms on rooms.room="%s" and rooms.id=books.roomid) inner join authors on books.authorid=authors.id)', roomname);
  
    db.query(findbooks, function(err, results){
      res.send(results);
    });
  });


  app.post('/books/search', function(req, res){
    var bookName = req.body.bookName;
    var findBook = util.format('select rooms.room, authors.author from ((rooms inner join books on rooms.id =books.roomid) inner join authors on authors.id=books.authorid and books.booktitle="%s")',bookName);
    db.query(findBook, (err, results) => {
      res.send(results);
    });
  });

  app.post('/author/search', function(req, res){
    var authorName = req.body.authorName;
    var findQry = util.format('select rooms.room, books.booktitle from ((rooms inner join authors on authors.author="%s") inner join books on authors.id=books.authorid and rooms.id=books.roomid)', authorName);
    db.query(findQry, (err, results)=>{
      res.send(results);
    });
  });















