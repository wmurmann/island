var express = require('express');
var fs = require("fs");
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'bower_components')));

//render the 
app.get('/',function (req,res) {
	//check if user is signed in, if they are redirect to the match screen, if not redirect to login screen
	if(req.cookies.name != undefined)
	{
		res.redirect("/match");	
	}
	else
	{
	    res.redirect("/login");
	}
});

app.get('/login',function (req,res) {
	//check if user is signed in, if they are redirect to the match screen
	if(req.cookies.name != undefined)
	{
		res.redirect("/match");	
	}
	else
	{
	    res.render("login");
	}
});

//render the "match" page
app.get('/match',function (req,res) {
    //check if user is signed in, if not redirect to the login screen
	if(req.cookies.name != undefined)
	{
		res.render('match');	
	}
	else
	{
		res.redirect("/login");
	}
});

//login the user by saving their name and email, posted from the facebook api on the client side
app.post('/setCookie',function (req,res){
	var name = req.body.name;
	var email = req.body.email;
	res.cookie('name',name);
	res.cookie('email',email);
	console.log(req.body.name);
	res.send(null);
});

//unser the cookies used to keep the user logged in, name and email
app.post('/unsetCookie',function (req,res){
	res.clearCookie('name');
	res.clearCookie('email');
	res.send(null);
	console.log("check");
});


//either add the user and their favorites to the user objects, or update their favorites
app.post('/updateFavorite',function (req,res){
	var book = req.body.book;
	var movie = req.body.movie;
	var food = req.body.food;
	var game = req.body.game;

	var cookie_name = req.cookies.name;
	if(cookie_name != undefined)
	{
		var found = false;
		for(var userCount = 0; userCount < users_json['users'].length; userCount++)
		{
			if(users_json['users'][userCount]['name'] == cookie_name)
			{
				found = true;
				users_json['users'][userCount]['f_book'] = book;
				users_json['users'][userCount]['f_movie'] = movie;
				users_json['users'][userCount]['f_food'] = food;
				users_json['users'][userCount]['f_game'] = game;
				break;
			}
		}
		if(!found)
		{
			var temp_fav = 
			{
			    "name": req.cookies.name,
		        "email": req.cookies.email,
		        "f_book": book,
		        "f_movie": movie,
		        "f_food": food,
		        "f_game": game
		    };
		    users_json['users'].push(temp_fav);
		}
	}
	console.log(users_json);
});

app.post('/getMatches',function (req,res){
	var cookie_name = req.cookies.name;
	var users_minus_current_user = users_json;
	for(var userCount = 0; userCount < users_minus_current_user['users'].length; userCount++)
	{
		if(users_minus_current_user['users'][userCount]['name'] == cookie_name)
		{
			delete users_minus_current_user.users.splice(userCount,1);
			break;
		}
	}
	res.json(users_minus_current_user);
});

app.listen(1337,function(){
	console.log('ready on port 1337');
});

var users_json = {
    "users": [
        {
            "name": "John Smith",
            "email": "j.smith@gmail.com",
            "f_book": "Harry Potter",
            "f_movie": "Batman",
            "f_food": "Banana",
            "f_game": "Pokemon"
        },
        {
            "name": "Harry Smith",
            "email": "h.smith@gmail.com",
            "f_book": "Moby Dick",
            "f_movie": "apple",
            "f_food": "2",
            "f_game": "3"
        }
    ]
};