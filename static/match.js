$( document ).ready(function() {
	var match = (function (){
        
		var submit = $('#favorite_submit');
		var logout = $('#logout');
		var reset = $('#reset_submit');
		var movie_titles = [];
        var init = function()
        {

            $('.center_box').on('submit',function(e){
            	e.preventDefault();
            });

            //The next for functinos call the functions for autocomplete
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

            //submit form to get matches
            submit.on("click", function(event) {
                getMatches(getFavorites(submit));
            });

            //reset form
            reset.on("click", function(event) {
            	$('#favorites').find("input[type=text], textarea").val("");
            	$('#result').hide();
            	$('#query').show();
            	$('#match').text('');
            });

        };

        //retrieve the autocomplete information from norch(search engine/server)
        //give autocomplete data to the jquery-ui widget
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

        //send the user's most current favorites to server to update
        var setFavorites = function(favorites)
       	{
			var favs = {
				book: favorites[0],
				movie: favorites[1],
				food: favorites[2],
				game: favorites[3]
			};
			$.ajax({
				type:"POST",
				data: favs,
				url: "http://localhost:1337/updateFavorite",
				success: function (response)
				{
				}
			});
       	};

       	//get the favorites from the form
        var getFavorites = function()
        {
        	var books = $('#book_suggest').val();
        	var movies = $('#movie_suggest').val();
        	var food = $('#food_suggest').val();
        	var games = $('#game_suggest').val();
        	var favorites =[books,movies,food,games];
        	setFavorites(favorites);
        	return [books,movies,food,games];
        };

        //get the users' favorite's from the node server
        //call the bestMatch funciton with the result from the server
        var getMatches = function(favorites)
        {
			$.ajax({
				type:"POST",
				url: "http://localhost:1337/getMatches",
				success: function (users)
				{
					bestMatch(favorites,users);
				}
			});
        };

        //determine the best match from all the users and display the best match
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
        			bestMatch.push(saved_favorites['users'][i]["name"]);
        			bestMatch.push(saved_favorites['users'][i]["email"]);
        			commonalities = incommon;
        		}
        	}
            if (bestMatch.length > 0)
            {
            	// make common items array look nice with commas and 'and'
            	var commonalities_to_string = "";
            	if(commonalities.length > 2)
            	{
            		for(var count = 0; count < commonalities.length; count++ )
            		{
            			console.log(commonalities[count]);
            			if(count == commonalities.length - 1)
            			{
            				commonalities_to_string += ("and " + commonalities[count]);
            			}
            			else
            			{
            				commonalities_to_string += ( commonalities[count] + ", ");
            			}
            		}
            	}
            	else
            	{
            		commonalities_to_string = commonalities;
            	}

            	$("#query").hide();
            	$("#match").text(bestMatch[0] + " and you both like " + commonalities_to_string + ". Contact your match by their email: " + bestMatch[1]+".");
            	$("#result").show();
            }
            else
            {
            	$("#query").hide();
            	$("#match").text("No match found, its going to be a lonely island.");
            	$("#result").show();
            }
        };
        return {
            init: init
        };
    })();
    match.init();
});