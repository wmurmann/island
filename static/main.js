$( document ).ready(function() {
	var match = (function (){
        
		var submit = $('#favorite_submit');
		var reset = $('#reset_submit');
        var init = function()
        {
            $('.center_box').on('submit',function(e){
            	e.preventDefault();
            });
            submit.on("click", function(event) {
                getMatches(getFavorites(submit));
            });
            reset.on("click", function(event) {
            	$('#favorites')[0].reset();
            	$('#result').hide();
            	$('#query').show();
            	$('#match').text('');
            });

        };
        var getFavorites = function()
        {
        	var books = $('#books')[0].selectedIndex;
        	var movies = $('#movies')[0].selectedIndex;
        	var food = $('#food')[0].selectedIndex;
        	var games = $('#games')[0].selectedIndex;
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
        {
        	var book = favorites[0];
        	var movie = favorites[1];
        	var food = favorites[2];
        	var game = favorites[3];

        	var bestMatch = [];
        	var commonalities = [];
        	var matchCount = 0;
        	for (var i = 0; i < saved_favorites['users'].length; i++) {
        		var currentCount = 0;
        		var incommon = [];
        		console.log(saved_favorites['users']);
        		if(book == saved_favorites['users'][i]['f_book']){
        			currentCount++;
        			incommon.push(book);
        		}
        		if(movie == saved_favorites['users'][i]['f_movie']){
        			currentCount++;
        			incommon.push(saved_favorites['users'][i]['f_movie']);
        		}
        		if(food == saved_favorites['users'][i]['f_food']){
        			currentCount++;
        			incommon.push(saved_favorites['users'][i]['f_food']);
        		}
        		if(game == saved_favorites['users'][i]['f_game']){
        			currentCount++;
        			incommon.push(saved_favorites['users'][i]['f_game']);
        		}
        		else if(currentCount > matchCount )
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
        }
        return {
            init: init
        };
    })();
    match.init();
});