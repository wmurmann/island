$( document ).ready(function() {
	var match = (function (){
        
		var submit = $('#favorite_submit');
		var reset = $('#reset_submit');
		var movie_titles = [];
        var init = function()
        {
            $('.center_box').on('submit',function(e){
            	e.preventDefault();
            });
            $("#movie_suggest").on('keyup',function(e){
                if(e.which <= 90 && e.which >= 48 || e.keyCode == 8)
                {
                   e.preventDefault();
                   match_query("movie");
                 }
            });
            $("#food_suggest").on('keyup',function(e){
                if(e.which <= 90 && e.which >= 48 || e.keyCode == 8)
                {
                   e.preventDefault();
                   match_query("food");
                 }
            });
            $("#book_suggest").on('keyup',function(e){
                if(e.which <= 90 && e.which >= 48 || e.keyCode == 8)
                {
                   e.preventDefault();
                   match_query("book");
                 }
            });
            $("#game_suggest").on('keyup',function(e){
                if(e.which <= 90 && e.which >= 48 || e.keyCode == 8)
                {
                   e.preventDefault();
                   match_query("game");
                 }
            });

            submit.on("click", function(event) {
                getMatches(getFavorites(submit));
            });
            reset.on("click", function(event) {
            	$('#favorites').find("input[type=text], textarea").val("");
            	$('#result').hide();
            	$('#query').show();
            	$('#match').text('');
            });

        };
        var match_query = function(filter)
        {
        	var search = $('#'+filter+'_suggest').val();
        	//bug with auto suggest, replace spaces with underscore to fix for not
        	search = search.replace(/ /g, '_');
        	var url = "http://localhost:3030/matcher?beginsWith="+filter+"_"+search;

        	$.ajax({
        	  tyep:"POST",
			  dataType: "jsonp",
			  url: url,
			  success: function (response)
			  {
			  	console.log(response);
			  	//get rid of underscore to display nicely 
				for (var i = response.length - 1; i >= 0; i--) {
					response[i] = response[i].replace(/_/g, ' ');
					response[i] = response[i].split(' ').slice(1).join(' ');
				}
				movie_titles = response;

				//call jquery autocomplete function
				$("#movie_suggest").autocomplete({
				source: movie_titles
			  	});
				$("#food_suggest").autocomplete({
				source: movie_titles
			  	});
				$("#book_suggest").autocomplete({
				source: movie_titles
			  	});
			  	$("#game_suggest").autocomplete({
				source: movie_titles
			  	});
			  },
			  error: function (response)
			  {
			  	//oops
			  }
			});
        };
        var getFavorites = function()
        {
        	var books = $('#book_suggest').val();
        	var movies = $('#movie_suggest').val();
        	var food = $('#food_suggest').val();
        	var games = $('#game_suggest').val();
        	return [books,movies,food,games];
        }
        var getMatches = function(favorites)
        {
			$.ajax({
			  dataType: "json",
			  url: 'users.txt',
			  success: function (users)
			  {
				bestMatch(favorites,users);
			  },
			  error: function (response)
			  {
			  	//handle error
			  }
			});
        };
        var bestMatch = function(favorites,saved_favorites)
        //compare array of saved users favorites to the current users favorits
        {
        	var book = favorites[0];
        	var movie = favorites[1];
        	var food = favorites[2];
        	var game = favorites[3];

        	var bestMatch = [];
        	var commonalities = [];
        	var matchCount = 0;

        	for (var i = 0; i < saved_favorites['users'].length; i++) 
        	{

        		var currentCount = 0;
        		var incommon = [];

        		if(book.toLowerCase() == saved_favorites['users'][i]['f_book'].toLowerCase()){
        			currentCount++;
        			incommon.push(book);
        		}
        		if(movie.toLowerCase() == saved_favorites['users'][i]['f_movie'].toLowerCase()){
        			currentCount++;
        			incommon.push(movie);
        		}
        		if(food.toLowerCase() == saved_favorites['users'][i]['f_food'].toLowerCase()){
        			currentCount++;
        			incommon.push(food);
        		}
        		if(game.toLowerCase() == saved_favorites['users'][i]['f_game'].toLowerCase()){
        			currentCount++;
        			incommon.push(game);
        		}
        		
        		if(currentCount > matchCount )
        		{
        			matchCount = currentCount;
        			bestMatch = [];
        			bestMatch.push(saved_favorites['users'][i]["email"]);
        			commonalities.push(incommon.join(","));
        		}
        	}
            if (bestMatch.length > 0)
            {
            	$("#query").hide();
            	$("#match").text(bestMatch[0] + " and you both like " + commonalities[1]);
            	$("#result").show();
            }
            else
            {
            	$("#query").hide();
            	$("#match").text("No match found, its going to be a lonely island.");
            	$("#result").show();
            }
        }
        return {
            init: init
        };
    })();
    match.init();
});