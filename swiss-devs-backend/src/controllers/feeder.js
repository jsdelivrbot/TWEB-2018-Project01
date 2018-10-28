
const fetch = require("node-fetch");
var mongoose = require("mongoose");
const User = require("../model/user");
const Bottleneck = require("bottleneck");


const limiter = new Bottleneck({
	maxConcurrent: 1,
	minTime: 2000
});

class ResponseError extends Error {
	constructor(res, body) {
		super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
		this.status = res.status;
		this.path = res.url;
		this.body = body;
	}
}

class Feeder {
	constructor({token, baseUrl = "https://api.github.com/"}) {
		this.token = token;
		this.baseUrl = baseUrl;
		this.cantons = {"AG":"Aargau", "AI":"Appenzell Inner Rhoden", "AR":"Appenzell Outer Rhoden", "BE":"Berne", "BL":"Basle-Country", "BS":"Basle-City", "FR":"Fribourg", "GE":"Geneva", "GL":"Glaris", "GR":"Grisons", "JU":"Jura", "LU":"Lucerne", "NE":"Neuchatel", "NW":"Nidwalden", "OW":"Obwalden", "SG":"St. Gall", "SH":"Schaffhausen", "SO":"Solothurn", "SZ":"Schwyz", "TG":"Thurgau", "TI":"Ticino", "UR":"Uri", "VD":"Vaud", "VS":"Valais", "ZG":"Zug", "ZH":"Zurich"};
		this.cities = {"Aarau":"AG ","Aarberg":"BE","Aarburg":"AG","Adliswil":"ZH","Aesch (BL)[note 1]":"BL","Affoltern am Albis[note 2]":"ZH","Agno[note 2]":"TI","Aigle":"VD","Allschwil[note 2]":"BL","Altdorf (UR)[note 2]":"UR","Altstätten":"SG","Amriswil":"TG","Appenzell[note 1]":"AI","Arbon":"TG","Arlesheim[note 2]":"BL","Arosa[note 2]":"GR","Arth[note 1]":"SZ","Ascona":"TI","Aubonne":"VD","Avenches":"VD","Baar":"ZG","Baden":"AG","Basel":"BS","Bassersdorf":"ZH","Bellinzona":"TI","Belp":"BE","Bern":"BE","Beromünster":"LU","Biasca":"TI","Biel/Bienne":"BE","Binningen":"BL","Birsfelden":"BL","Bischofszell":"TG","Boudry":"NE","Bourg-Saint-Pierre":"VS","Bremgarten (AG)":"AG","Brig-Glis":"VS","Brugg":"AG","Buchs (SG)":"SG","Bülach":"ZH","Büren a.A.":"BE","Bulle":"FR","Burgdorf":"BE","Bussigny":"VD","Carouge (GE)":"GE","Cham":"ZG","Châtel-Saint-Denis":"FR","Chêne-Bougeries":"GE","Chiasso":"TI","Chur":"GR","Conthey":"VS","Coppet":"VD","Cossonay":"VD","Croglio":"TI","Crissier":"VD","Cudrefin":"VD","Cully":"VD","Davos*":"GR","Delémont":"JU","Diessenhofen":"TG","Dietikon":"ZH","Dübendorf":"ZH","Ebikon":"LU","Échallens":"VD","Ecublens (VD)":"VD","Eglisau":"ZH","Einsiedeln":"SZ","Elgg":"ZH","Emmen":"LU","Erlach":"BE","Estavayer-le-Lac":"FR","Flawil":"SG","Frauenfeld":"TG","Freienbach":"SZ","Fribourg":"FR","Geneva":"GE","Gland":"VD","Glarus":"GL","Glarus Nord*":"GL","Gordola":"TI","Gossau (SG)":"SG","Grandcour":"VD","Grandson":"VD","Greifensee":"ZH","Grenchen":"SO","Grüningen":"ZH","Gruyères":"FR","Herisau":"AR","Hermance":"GE","Hinwil":"ZH","Horgen":"ZH","Horw":"LU","Huttwil":"BE","Ilanz":"GR","Illnau-Effretikon":"ZH","Interlaken":"BE","Ittigen":"BE","Kaiserstuhl (AG)":"AG","Klingnau":"AG","Kloten":"ZH","Köniz[note 2]":"BE","Kreuzlingen":"TG","Kriens":"LU","Küsnacht (ZH)":"ZH","La Chaux-de-Fonds":"NE","La Neuveville":"BE","La Sarraz":"VD","La Tour-de-Peilz":"VD","La Tour-de-Trême":"FR","Lachen (SZ)":"SZ","Lancy":"GE","Langenthal":"BE","Laufen (BL)":"BL","Laufenburg":"AG","Laupen":"BE","Lausanne":"VD","Le Grand-Saconnex":"GE","Le Landeron":"NE","Le Locle":"NE","Lenzburg":"AG","Les Clées":"VD","Leuk":"VS","Lichtensteig":"SG","Liestal":"BL","Locarno":"TI","Losone":"TI","Lugano":"TI","Lutry":"VD","Lucerne":"LU","Lyss":"BE","Männedorf":"ZH","Maienfeld":"GR","Martigny":"VS","Meilen":"ZH","Mellingen":"AG","Mendrisio":"TI","Meyrin":"GE","Möhlin":"AG","Monthey":"VS","Montreux":"VD","Morcote":"TI","Morges":"VD","Moudon":"VD","Moutier":"BE","Münchenbuchsee":"BE","Münchenstein":"BL","Münsingen":"BE","Muri bei Bern":"BE","Murten":"FR","Muttenz":"BL","Neuchâtel":"NE","Neuhausen am Rheinfall":"SH","Neunkirch":"SH","Nidau":"BE","Nyon":"VD","Oberwil (BL)":"BL","Oftringen":"AG","Olten":"SO","Onex":"GE","Opfikon":"ZH","Orbe":"VD","Orsières":"VS","Ostermundigen":"BE","Payerne":"VD","Peseux":"NE","Pfäffikon":"ZH","Plan-les-Ouates":"GE","Porrentruy":"JU","Pratteln":"BL","Prilly":"VD","Pully":"VD","Rapperswil-Jona":"SG","Regensberg":"ZH","Regensdorf":"ZH","Reinach (BL)":"BL","Renens (VD)":"VD","Rheinau":"ZH","Rheineck":"SG","Rheinfelden":"AG","Richterswil":"ZH","Riehen":"BS","Risch":"ZG","Riva San Vitale":"TI","Rolle":"VD","Romainmôtier":"VD","Romanshorn":"TG","Romont (FR)":"FR","Rorschach":"SG","Rue":"FR","Rüti (ZH)":"ZH","Saillon":"VS","Saint-Maurice":"VS","Saint-Prex":"VD","Saint-Ursanne":"JU","Sargans":"SG","Sarnen":"OW","Schaffhausen":"SH","Schlieren":"ZH","Schwyz":"SZ","Sembrancher":"VS","Sempach":"LU","Sierre":"VS","Sion":"VS","Solothurn":"SO","Spiez":"BE","Spreitenbach":"AG","Splügen":"GR","St. Gallen":"SG","St. Moritz":"GR","Stäfa":"ZH","Stans":"NW","Steckborn":"TG","Steffisburg":"BE","Steinhausen":"ZG","Suhr":"AG","Stein am Rhein":"SH","Sursee":"LU","Thalwil":"ZH","Thônex":"GE","Thun":"BE","Thusis":"GR","Unterseen":"BE","Urdorf":"ZH","Uster":"ZH","Uznach":"SG","Uzwil":"SG","Val-de-Travers":"NE","Valangin":"NE","Vernier":"GE","Versoix":"GE","Vevey":"VD","Veyrier":"GE","Villeneuve":"VD","Villars-sur-Glâne":"FR","Visp":"VS","Volketswil":"ZH","Wädenswil":"ZH","Waldenburg":"BL","Walenstadt":"SG","Wallisellen":"ZH","Wangen an der Aare":"BE","Werdenberg":"SG","Weinfelden":"TG","Wettingen":"AG","Wetzikon (ZH)":"ZH","Wiedlisbach":"BE","Wil (SG)":"SG","Willisau":"LU","Winterthur":"ZH","Wohlen (AG)":"AG","Yverdon-les-Bains":"VD","Zermatt":"VS","Zofingen":"AG","Zollikofen":"BE","Zollikon":"ZH","Zug":"ZG","Zürich":"ZH","Bad Zurzach":"AG"};
	}

	setToken(token) {
		this.token = token;
	}

	ghRequest(path, opts = {}) {
		const custom_url = `${this.baseUrl}${path}`;
		//console.log(`Fetched ===> ${url}`);
		const options = {
			...opts,
			url: custom_url,
			headers: {
				Accept: "application/vnd.github.v3+json",
				Authorization: `token ${this.token}`,
				"User-Agent": "Swiss devs backend"
			},
		};
    
		return limiter.schedule(() => fetch(custom_url, options)
			.then(res => res.json()
				.then((data) => {
					console.log("New request: " + custom_url);
					if (!res.ok) {
						throw new ResponseError(res, data);
					}
					return data;
				}).catch(function(error) {
					console.log(error);
				})).catch(function(error) {
				console.log(error);
			}));
		/*return new Promise((resolve, reject) => {
          return request(options, function(error, response, body) {
              if (error) {
                console.log("Error during request: " + error);
                throw new ResponseError(error, body);
              } else {
                //console.log(JSON.stringify(JSON.parse(body),null,2));
                resolve(JSON.parse(body));
              }
          });
        });*/
	}

	fetchUsers(location, canton = null) {
		this.ghRequest(`search/users?q=location:${location}:&per_page=${1}`).then(
			(obj) => {
				return obj.total_count;
			}
		).catch(function(error) {
			console.log(error);
		}).then((total_count) => {
			console.log(total_count);
			var nbrProcessed = 0;
			var pageNbr;
			var perPages = 100;
			var users_login = [];
			for(pageNbr = 1; pageNbr <= Math.min(Math.ceil(total_count/perPages), 1000 / perPages); pageNbr++) {
				this.ghRequest(`search/users?q=location:${location}:&per_page=${perPages}&page=${pageNbr}`).then(
					(obj) => {
						console.log("Number of users: " + obj.total_count);
						nbrProcessed += obj.items.length;
						console.log("Processed: " + nbrProcessed);

						obj.items.forEach(element => {
							// Check if users already in DB
							// Fetch users details
							// Fetch users languages
							// Save user
							//console.log(element);
							users_login.push(element.login);
							User.findOne({ username: element.login }, (err, doc) => {
								if (err) console.log("Error occured: " + err);
                
								// Users doesn't exists we fetch details and create it
								if (!doc) {
									// Fetch user details
									this.ghRequest(`users/${element.login}`).then((user_detail) => {
										// Fetch user repos in order to get the languages used
										console.log("Element.login => " + element.login);
										this.ghRequest(`search/repositories?q=@${element.login}`).then((repos) => {                     
                      
											// Get users languages used in repositories
											var array_languages = [...new Set(repos.items.map(repo => { return repo.language; }))];
											array_languages.splice( array_languages.indexOf(null), 1 );
                      
											// When we search cities as Location and not canton
											// We use the canton passed in parameter
											let _canton = null;
											if (canton != null)
												_canton = canton;
											else
												_canton = location;

											// Now we can create and store in DB our new user
											User.create({
												_id: new mongoose.mongo.ObjectId(),
												username: user_detail.login,
												id_github: user_detail.id,
												profile_url: user_detail.url,
												name: user_detail.name,
												company: user_detail.company,
												blog: user_detail.blog,
												hireable: user_detail.hireable,
												email: user_detail.email,
												bio: user_detail.bio,
												languages: array_languages,
												location: user_detail.location,
												canton: _canton
											}, function(error) {
												console.log("Error during saving the user " + user_detail.login);
												console.log(error);
											});

											console.log("User <" + user_detail.login + "> correctly saved in DB. ");
										}).catch(function(repo_error) { console.log("Error fetching repos: " + repo_error); });
									}).catch(function(user_detail_error) { console.log("Error fetching user details: " + user_detail_error); });
								}
							});
						});
					}
				).catch(function(error) {
					console.log(error);
				});
				//console.log(res);
				//return console.log(this.mongoClient.collection().find());
			}
		});
	}

    feed() {
      var promises = [];
      /*for (var loc in this.cantons) {
        const p1 = new Promise((resolve, reject) => {
          this.fetchUsers(this.cantons[loc]);
          setTimeout(resolve, 5000);
          console.log(reject);
        });
        promises.push(p1);
      }*/
      for (var city in this.cities) {
        const p1 = new Promise((resolve, reject) => {
          this.fetchUsers(city, this.cities[city]);
          setTimeout(resolve, 5000);
          console.log(reject);
        });
        promises.push(p1);
      }
      Promise.all(promises).then(function() {
        console.log("Finished all locations feeding");
      })
    }

}

module.exports = Feeder;