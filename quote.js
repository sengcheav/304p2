var express = require('express');

// added cors
var app = express()
	, pg = require('pg').native
   , connectionString = process.env.DATABASE_URL
   , cors = require('cors')
	, port = process.env.PORT
  	, client;


client = new pg.Client(connectionString);
client.connect();
var quotes = [
  { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don’t be afraid to take that first step."},
  { author : 'Neale Donald Walsch', text : "You are afraid to die, and you’re afraid to live. What a way to exist."}
];

// make express handle JSON and other requests
app.use(express.bodyParser());
// serve up files from this directory 
app.use(express.static(__dirname));
// make sure we use CORS to avoid cross domain problems
app.use(cors());

app.get('/quote/random', function(req, res) {
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  res.send(q);
});

app.get('/quote/:id', function(req, res) {
//  if(quotes.length <= req.params.id || req.params.id < 0) {
  if(req.params.id < 0 ){
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

 // var q = quotes[req.params.id];
  //res.send(q);
  query = client.query('SELECT author, text FROM quote WHERE id = $1', [req.params.id]);
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
      return res.send('No data found');
    } else {
      res.send(result);
    }
  }); 
   
});


app.post('/quote', function(req, res) {
  var position =0 ;
  console.log(req.body);
  if(!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newQuote = {
    author : req.body.author,
    text : req.body.text
  };
  
  newQuote.pos = quotes.length;
/*    query = client.query('SELECT COUNT(id) AS COUNT FROM quote ');
    query.on('row', function(result , err) {
    if(!result){ console.log(err);}  
    else {
    console.log("---------------------" + result.count);
    position = (result.count) ;  
    return position;
    }	  
  });*/
/*  console.log("++++++" + position); 
  query = client.query('INSERT INTO quote (id , author , text) VALUES($1, $2, $3)', [
    (function(fn){
    query = client.query('SELECT COUNT(id) AS COUNT FROM quote '); 	 
    query.on('row', function(result,err) {
    // console.log("---------------------" + result.count);
    //return parseInt(result.count) ;
    if(!result){ console.log(err) ;}
    else {
   	 fn = result.count;
	 console.log ("fn"+ fn); 	 
fn;} 		
    });
})
 , newQuote.author , newQuote.text]);
  //quotes.push(newQuote);
  // should send back the location at this point
  console.log("Added!");
  //newQuote.pos = quotes.length-1;
  res.send(newQuote);*/

 query = client.query('SELECT COUNT(id) AS COUNT FROM quote ');
    query.on('row', function(err , result  ) { 
	if (err){}	
	else {
	 query = client.query('INSERT INTO quote (id , author , text) VALUES($1, $2, $3)', [result.count , newQuote.author, newQuote.text]);
	 query.on ('row', function (err, ressult1){
	 if(err) { }
	 });
	}

    });
res.send(newQuote);





});

app.delete('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  quotes.splice(req.params.id, 1);
  res.json(true);
});

// use PORT set as an environment variable
var server = app.listen(process.env.PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
