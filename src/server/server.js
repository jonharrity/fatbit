var express = require('express');
var app = express();
var port = (process.env.PORT || 3000);
var maxStateStorageTime = 1000 * 60 * 5;

app.set('states', {});

app.get('/', (req,res) => res.sendFile(__dirname+'/index.html'));
app.get('/cb', (req,res) => {
	var store = app.get('states');
//	var code = red . something
//	var state = req . something
//	store[state].code = code;
});
app.get('/push', (req,res) => {
	var store = app.get('states');
//	var state = req.something
//	states[ state ] = {time: timestamp}
	setTimeout(() => {
		var store = app.get('states');
		delete store[state];
	}, maxStateStorageTime, 'put the state here');
});
app.get('/pop', (req,res) => {
	var store = app.get('states');
//	var state = req. something;
//	var code = store[state].code; --put in try or something
//	res.send( the access token ));
	res.send('nothing yet :/');
});
app.listen(port,()=>console.log('fatbit server started'));
