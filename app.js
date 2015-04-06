var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser());
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'bower_components')));

app.get('/',function (req,res) {
	res.render('index');
});

app.get('/match',function (req,res) {
	res.render('match');
});

app.listen(1337,function(){
	console.log('ready on port 1337');
});