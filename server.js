const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const key = require('./config');
const civKey = key.key;


//CORS middleware
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Body-Parser parses incoming urlencoded form data
// and populate the req.body object
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/************
*URL*
*************/
// const representative_endpoint = `https://www.googleapis.com/civicinfo/v2/representatives?address=${}&key=${}`;

/************
*DATABASE*
*************/

const db = require('./models');

/************
*Routes* --> All Routes/Endpoints
*************/

// Serve static files from public/ and /vendors
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/vendors'));


// HTML ENDPOINTS
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/views/profile.html');
});

app.get('/rep_detail', (req, res) => {
  res.sendFile(__dirname + '/views/rep_detail.html');
});

app.get('/results', (req, res) => {
  res.sendFile(__dirname + '/views/results.html');
});


// JSON Routes

app.get('/api/rep-info', (req, res) => {
	console.log('Man dang');
	// res.json();
})

// INDEX route to display all rep info
app.get('/api/rep-details', (req, res) => {
	db.Rep.find( (err, reps) => {
		if (err) {console.log(`Error at displaying all reps is: ${err}`)}
		res.json(reps);
	});
});

// INDEX route to display saved messages
app.get('/api/saved-messages', (req, res) => {
	db.SavedMessages.find( (err, messages) => {
		if (err) {console.log(`Error at displaying saved messages: ${err}`)}
			res.json(messages);
	});
});

// Post route that queries the API and sends info back to the front end
app.post('/api/rep-info', (req, res) => {

	const zip = req.body.zip;

	request(`https://www.googleapis.com/civicinfo/v2/representatives?address=${zip}&key=${civKey}`, (err, res, body) => {
		if (err) { console.log(`Error in server request to Civic API is: ${err}`) }
		const data = JSON.parse(body);
	}).pipe(res);
});

// POST route from post-fetch ajax call to create save Reps in database for use on Search Results page
app.post('/api/rep-details', (req, res) => {
	let repList = req.body.data;
	console.log(repList);

	db.Rep.deleteMany({}, (err, reps) => {
		if (err) {console.log(`Error at rep deletion is: ${err}`)}
		console.log('Deleted all reps!');

		db.Rep.create(repList, (err, newRep) => {
			if (err) {console.log(`Error at create new rep is: ${err}`)}
			console.log('New rep created!');
			//process.exit(); 
		});
	});
});

// Message Create Then Post
app.post('/api/saved-messages', (req, res) => {
	let message = req.body;

	db.SavedMessages.create(message, (err, newMessage) => {
		if (err) throw err;
		res.json(newMessage);
	});
});

// UPDATE message
app.put('/api/saved-messages/:id', (req, res) => {
	let messageId = req.params.id;
	let newMessage = req.body.message;
	console.log(req.body);

	db.SavedMessages.findOneAndUpdate({_id: messageId}, {$set: req.body}, { new: true }, (err, updatedMessage) => {
		if (err) {console.log(`Backend error at updateBook is: ${err}`)}
		res.json(updatedMessage);
	});
});

// DELETE message
app.delete('/api/saved-messages/:id', (req, res) => {
	let messageId = req.params.id;
	console.log(messageId);

	db.SavedMessages.findByIdAndDelete(messageId, (err, deletedMessage) => {
		if (err) {console.log(`Error at server delete route is: ${err}`)}
		res.json(deletedMessage);
	});
});

/************
*Redirects*
*************/

app.get('/results', (req,res) => {
	res.redirect('/profile');
});





// Express server set up
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server is up and running on port 3000');
});
