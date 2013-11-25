//qwery is een selector enging. Werkt ook met multi-selects (div, p) en css3 atribute selectors.

//routie neemt een waarde die achter de hash staat en koppelt dit aan een functie.

//transparancy is een template engine die objecten bind met elementen dmv id, classes en data-bind.

//ready kijkt of alles geladen is en voert daarna iets uit.


var APP = APP || {};// Namespace object


(function () { // anonieme functie

	'use strict';

	APP.directives = {

				teamName:{
					text: function(params){
						return params.text = this.team.name;
					}
				},

				win:{
					text: function(params){
						return params.text = this.wins;
					}
				},

				lost:{
					text: function(params){
						return params.text = this.losses;
					}
				},

				plays:{
					text: function(params){
						return params.text = this.games_played;
					}
				},

				team_1:
						{
						text: function(params){
						return params.text = this.team_1.name;
						}
					},
							
				team_2: {
						text: function(params){
						return params.text = this.team_2.name;
						}
					},

				score:
						{
						text: function(params){
						return params.text = this.team_1_score + " - " + this.team_2_score;
						}
					},

				score_1:
						{
							value: function(params){
							return this.team_1_score;
							}
					},

				score_2:
						{
							value: function(params){
							return this.team_2_score;
							}
					},

				date:
					{
						text: function(params){
							var date = new Date(this.start_time);
							var day_names = new Array("Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag");
							var curr_day = date.getDay();
							console.log(day_names + date);
							var minutes = date.getMinutes();
							//minutes = "01"
							if (minutes < 2) {
								minutes = "0" + date.getMinutes();
							}
							return day_names[curr_day] + ",	" + date.getHours() + " : " + minutes;
						}
					},

				game_id:{
						href: function(params){
							return "#/game/" + this.id;
						}
				},

				game_update:{
							
						href: function(params){
							return "javascript:APP.post.updateGame(" + this.id + ");";
						}	
				},

				poolNameGame:{
							text: function(params){
							return params.text = "POOL: " + this.pool.name;
						}
				},

				poolNameRanking:{
							text: function(params){
							return params.text = "POOL: " + this.name;
						}
				}


	};

	// Controller Init
	APP.controller = {
		init: function () {
			// Initialize router
			APP.router.init();
		}
	};

	// Router
	APP.router = {
		init: function () {
	  		routie({
			    '/home': function() {
			    	APP.loader.start();
			    	APP.page.home();
				},
			    '/game': function() {
			    	APP.loader.start();
			    	APP.page.game();
			    },

			    '/game/:id': function( gameId ) {
			    	APP.loader.start();
					APP.page.updateGame( gameId );
				},

			    '/ranking': function() {
			    	APP.loader.start();
			    	APP.page.ranking();
			    },

			    '*': function() {
			    	APP.loader.start();
			    	APP.page.home();
			    }
			});

			//	Hook.js pull-to-refresh
			$('#body').hook({reloadPage: true});
			
			$$('#body').doubleTap(function(){
				location.reload();
			});		
		},

		change: function () {
            var route = window.location.hash.slice(2),// slices alles na de hash (0) is met de hash.
                sections = qwery('section[data-route]'), //section array data-route
                section = qwery('[data-route=' + route + ']')[0]; // data route is wat na de hash komt
             console.log(route);// wat doet location.hash.slice precies  

            // Show active section, hide all other
            if (section) {
            	for (var i=0; i < sections.length; i++){ // ga door de array sections heen en haal alle active classes weg.
            		sections[i].classList.remove('active');
            	}
            	section.classList.add('active');//Voeg active toe aan de geselecteerde section
            }

            // Default route
            if (!route) {
            	sections[0].classList.add('active');//de eerste section is standaart active
            }

		}
	};

	// Page
	APP.page = {	
		home: function () {
			APP.router.change();
			APP.loader.stop();
		},

		game: function () {
			$$.ajax({ //quo.js
				    type: 'GET', // defaults to 'GET'
				    url: 'https://api.leaguevine.com/v1/games/?pool_id=19222&access_token=acfa228f8c',
				    //data: {user: 'soyjavi', pass: 'twitter'},
				    dataType: 'json', //'json', 'xml', 'html', or 'text'
				    async: true,
				    success: function(response) {	
				    	console.log(response.objects[0]);
				    	//APP.game = response.objects;
				    	
				    	//console.log("game:", APP.game);
				    	
				    	Transparency.render(qwery('[data-list=game]')[0], response.objects, APP.directives);
						Transparency.render(qwery('[data-list=headerGame]')[0], response.objects[0], APP.directives);
						APP.router.change();//ga naar deze methode.
						APP.loader.stop();
				    },
				    error: function(xhr, type) { console.log("fail") }
				});
		},

		updateGame: function (gameId) {
			$$.ajax({ //quo.js
				    type: 'GET', // defaults to 'GET'
				    url: 'https://api.leaguevine.com/v1/games/' + gameId + '/',
				    //data: {user: 'soyjavi', pass: 'twitter'},
				    dataType: 'json', //'json', 'xml', 'html', or 'text'
				    async: true,
				    success: function(response) {	
				
				    	//APP.game = response;
				    	
				    	//console.log("gameinfo:", APP.game)

				    	Transparency.render(qwery('[data-route=updateGame]')[0], response, APP.directives);

				    	var section = qwery('[data-route=updateGame]')[0];
				    	var gameSection = qwery('[data-route=game]')[0];

				    	section.classList.add('active');

				    	gameSection.classList.remove('active');
				    	APP.loader.stop();

				    },
				    error: function(xhr, type) { console.log("fail") }
				});
		},

		ranking: function(){
			$$.ajax({ //quo.js
				    type: 'GET', // defaults to 'GET'
				    url: 'https://api.leaguevine.com/v1/pools/?pool_ids=%5B19222%5D&access_token=acfa228f8c',
				    //data: {user: 'soyjavi', pass: 'twitter'},
				    dataType: 'json', //'json', 'xml', 'html', or 'text'
				    async: true,
				    success: function(response) {	

				    	console.log(response.objects[0]);
				    	//APP.game = response.objects[0].standings;
				    	
				    	//console.log("game:", APP.game);
				    	Transparency.render(qwery('[data-list=headerRanking]')[0], response.objects[0], APP.directives);
				    	Transparency.render(qwery('[data-list=ranking]')[0], response.objects[0].standings, APP.directives);
						APP.router.change();//ga naar deze methode.
						APP.loader.stop();
				    },
				    error: function(xhr, type) { console.log("fail") }
				});
		}
	};

	APP.post = { 

			updateGame: function(gameID) {

                        var team1Score = document.getElementById('team1Score').value;
                        var team2Score = document.getElementById('team2Score').value;
                        var isFinal = "True";


                        var type = 'POST',
                                url = 'https://api.leaguevine.com/v1/game_scores/',
                                postData = JSON.stringify({
                                        game_id: gameID,
                                        team_1_score: team1Score,
                                        team_2_score: team2Score,
                                        is_final: isFinal
                                });

                        // Create request
                        var xhr = new XMLHttpRequest();

                        // Open request
                        xhr.open(type, url, true);

                        // Set request headers, including authorisation
                        xhr.setRequestHeader('Content-type', 'application/json');
                        xhr.setRequestHeader('Authorization', 'bearer ec4ff493f7');

                        // Send request
                        xhr.send(postData);

                        //        Re-render game page (server too slow to update from server after writing)
                        //        App.GameController.renderGame(gameID);

                        //        Update animation

                        APP.loader.start();      

                        window.setInterval( function(){

                       APP.loader.stop();      
                       window.location.href = "#/game";      

                        }, 2000);

                }


    };

    APP.loader = {
    	start: function() {

			document.getElementById('loader').classList.remove('noloader');

		},

		stop: function() {

			document.getElementById('loader').classList.add('noloader');

		}

	};

	// DOM ready
	domready(function () {
		console.log("Ready")
		// Kickstart application
		APP.controller.init();
	});

})();