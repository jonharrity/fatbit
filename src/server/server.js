var express = require('express');
var app = express();
var port = (process.env.PORT || 3000);
var maxStateStorageTime = 1000 * 60 * 5;

app.set('states', {});

app.get('/', (req,res) => res.sendFile(__dirname+'/index.html'));
app.get('/push', (req,res) => {
	var store = app.get('states');
	var state = req.query.state;
	if( typeof state === 'string' ) {
		store[state] = {time: Math.floor(new Date()/1000)};
		app.set('states', store);
		setTimeout((state) => {
			var store = app.get('states');
			delete store[state];
			app.set('states',store);
		}, maxStateStorageTime, state);
	}
	res.send('');
});
app.get('/cb', (req,res) => {
	var store = app.get('states');
	var state = req.query.state;
	var code = req.query.code;
	if( typeof state === 'string' && typeof code === 'string' && (typeof store[state] != 'undefined') ) {
		store[state].code = code;
		app.set('states',store);
		res.send('success');
	}
	else
		res.send('error');
});
app.get('/pop', (req,res) => {
	var store = app.get('states');
	var state = req.query.state;
	if( typeof state === 'string' && (typeof store[state] != 'undefined')) {
		res.send(store[state].code);
	}
	res.send('');
});
app.listen(port,()=>console.log('fatbit server started'));
