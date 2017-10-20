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
	var id = req.query.user_id;
	if( typeof state === 'string' && typeof code === 'string' && typeof id === 'string' && (typeof store[state] != 'undefined') ) {
		store[state].id = id;
		app.set('states',store);
		res.send('success');
		var xhr = new XMLHttpRequest();
		var basic = new Buffer('22CJHV:5b010441676c31c691685973128defb0').toString('base64');
		var params = 'client_id=22CJHV&grant_type=authorization_code&redirect_uri=https://desolate-river-72208.herokuapp.com'+req.originalUrl;
		xhr.open('POST','https://api.fitbit.com/oauth2/token',true);
		xhr.setRequestHeader('Authorization','Basic ' + basic);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(params);
		xhr.onreadystatechange = function(v) { 
			return () => {
				var n = v.n;
				if( n.readyState === XMLHttpRequest.DONE && n.status === 200 ) {
					var store = app.get('states');
					var state = v.state;
					store[state].token = JSON.parse(n.responseText).access_token;
				}
			};
		}({n: xhr, state: state});
	}
	else
		res.send('error');
});
app.get('/pop', (req,res) => {
	var store = app.get('states');
	var state = req.query.state;
	if( typeof state === 'string' && (typeof store[state] != 'undefined') && (typeof store[state].id != 'undefined') && (typeof store[state].token != 'undefined') ) {
		var obj = { 'token': store[state].token,
					'id': store[state].id};
		res.send(JSON.stringify(obj));
	}
	res.send('');
});
app.listen(port,()=>console.log('fatbit server started'));
