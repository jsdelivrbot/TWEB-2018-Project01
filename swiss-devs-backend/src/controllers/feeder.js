
const fetch = require('node-fetch');
var mongoose = require('mongoose');
const User = require('../model/user');

class ResponseError extends Error {
    constructor(res, body) {
      super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
      this.status = res.status;
      this.path = res.url;
      this.body = body;
    }
  }

class Feeder {
    constructor({token, db, baseUrl = 'https://api.github.com/'}) {
        this.token = token;
        this.baseUrl = baseUrl;
        this.db = db;
        this.cantons = {'AG':'Aargau', 'AI':'Appenzell Inner Rhoden', 'AR':'Appenzell Outer Rhoden', 'BE':'Berne', 'BL':'Basle-Country', 'BS':'Basle-City', 'FR':'Fribourg', 'GE':'Geneva', 'GL':'Glaris', 'GR':'Grisons', 'JU':'Jura', 'LU':'Lucerne', 'NE':'Neuchatel', 'NW':'Nidwalden', 'OW':'Obwalden', 'SG':'St. Gall', 'SH':'Schaffhausen', 'SO':'Solothurn', 'SZ':'Schwyz', 'TG':'Thurgau', 'TI':'Ticino', 'UR':'Uri', 'VD':'Vaud', 'VS':'Valais', 'ZG':'Zug', 'ZH':'Zurich'};
    }

    setToken(token) {
        this.token = token;
    }

    request(path, opts = {}) {
        const url = `${this.baseUrl}${path}`;
        console.log(`Fetched ===> ${url}`);
        const options = {
          ...opts,
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${this.token}`,
          },
        };
    
        return fetch(url, options)
          .then(res => res.json()
            .then((data) => {
              if (!res.ok) {
                throw new ResponseError(res, data);
              }
    
              return data;
            }));
      }

    fetchUsers(location) {
        this.request(`search/users?q=location:${location}:`).then(
          (obj) => {
            obj.items.forEach(element => {
              // Check if users already in DB
              // Fetch users details
              // Fetch users languages
              // Save user
              //console.log(element);
              User.findOne({ username: element.login }, (err, doc) => {
                // doc is a Document
                if (err) console.log("Une big errrreureee : " + err);
                
                // Users doesn't exists we fetch details and create it
                if (!doc) {
                  //console.log("User <" + element.login + "> doesn't exists. We create it.");
                  // Fetch user details
                  this.request(`users/${element.login}`).then((user_detail) => {
                    // Fetch user repos in order to get the languages used
                    console.log("Element.login => " + element.login);
                    this.request(`search/repositories?q=@${element.login}`).then((repos) => {
                        
                      var array_languages = [...new Set(repos.items.map(repo => { return repo.language; }))];
                      array_languages.splice( array_languages.indexOf(null), 1 );
                      /*console.log("Array languages: " + array_languages.toString());
                      console.log(element);
                      console.log(user_detail);
                      next;*/
                      // Now we can create and store in DB our new user
                      if (array_languages.length >= 1) {
                        console.log(element.login + " has many languages: " + array_languages );
                      }

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
                        languages: array_languages
                      }, function(error) {
                          console.log("error during saving the user " + user_detail.login);
                          console.log(error);
                      });
                      console.log("User <" + user_detail.login + "> saved in DB. ");
                    }).catch(function(repo_error) { console.log("Error fetching repos: " + repo_error); });
                    //console.log(user_detail);
                  }).catch(function(user_detail_error) {  console.log("Error fetching user details: " + user_detail_error); });
                  
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

    feed() {
      for (var loc in this.cantons) {
        this.fetchUsers(this.cantons[loc]);
        break;
      }
    }

}

module.exports = Feeder;