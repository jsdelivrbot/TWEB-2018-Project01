
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient

class ResponseError extends Error {
    constructor(res, body) {
      super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
      this.status = res.status;
      this.path = res.url;
      this.body = body;
    }
  }

class Github {
    constructor({token, mongo, baseUrl = 'https://api.github.com/'}) {
        this.token = token;
        this.baseUrl = baseUrl;
        this.mongoClient = mongo;
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
        return this.request(`search/users?q=location:${location}:`);
        //return console.log(this.mongoClient.collection().find());
    }

}

module.exports = Github;