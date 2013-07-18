var http = require('http');
var fs = require('fs');

var attacked_this_turn = false;
var board_graph = JSON.parse(fs.readFileSync("./board_graph.json"));

var board_graph_countries = {};
for (var bg_continents in board_graph){
	for(var bg_countries in board_graph[bg_continents].countries){
		board_graph_countries[bg_countries] = board_graph[bg_continents].countries[bg_countries];
	}
}

var serverCreated = false;
var serverPort = process.argv[2];
var my_name;

var serverFunction = function (req, res) {
	console.log("------REQUEST-----");
	var body = '';

	if(req.method == "POST"){
		req.on('data', function(chunk) {
			body += chunk;
		});

		req.on('end', function() {
			body = JSON.parse(decodeURIComponent(body).substring(5).replace(/\+/g, " "));
			req.body = body;
			respond(req, res);
		});
	} else{
		respond(req, res);
	}
};

function respond(req, res){
	if(req.url == "/status"){
		console.log("Responding to request for status with 200: ready to play!");
		res.writeHead(200);
		res.end("");
		return;
	}
	if(req.url == "/turn"){
		console.log("It's my turn!");
		res.writeHead(200, {'Content-Type': 'text/json'});
		var game = req.body.game;
		var you = req.body.you;
		my_name = you.name;
		console.log("I am " + my_name);

		console.log("Available actions are " + req.body.you.available_actions);

		var response = {"action": action, "data": {}};

		if(action == "choose_country"){

		} else if(action == "deploy_troops"){

		} else if(action == "spend_cards"){
			response.data = findCards(you.cards, []);
		} else if(action == "attack"){

		} else if(action == "reinforce"){

		} else if(action == "end_turn" || action == "end_attack_phase" || action == "pass"){
			//pass
		}
		console.log("Response: " + JSON.stringify(response));
		res.end(JSON.stringify(response));
	} else{
		console.log("Got a request for " + req.url + ", type " + req.method + ". Responding with nothing.");
		res.writeHead(200);
		res.end("");
	}
}

function getMyCountries(game, min_num_troops){
	var our_countries = {};
	for(var country_index in game.countries){
		if(game.countries[country_index].owner == my_name && game.countries[country_index].troops >= min_num_troops){
			our_countries[country_index] = game.countries[country_index];
			our_countries[country_index]["border countries"] = board_graph_countries[country_index]["border countries"];
		}
	}
	return our_countries;
}

function findReinforce(game){

}

function findCards(cards, set){
	for(var i = 0; i < cards.length - 2; i++){
		for (var j = i + 1; j < cards.length - 1; j++){
			for (var k = j + 1; k < cards.length; k++){
				if(isCardSet([cards[i], cards[j], cards[k]])){
					return([cards[i].country_name, cards[j].country_name, cards[k].country_name]);
				}
			}
		}
	}

}

function isCardSet(set){
	for(var i = 0; i < set.length ; i++){
		if(set[i].value == "wild") return true;
	}
	return(set[0].value == set[1].value && set[1].value == set[2].value) || (set[0].value != set[1].value && set[1].value != set[2].value && set[0].value != set[2].value);
}

http.createServer(serverFunction).listen(serverPort);
console.log("ERTBOT started on port " + serverPort);