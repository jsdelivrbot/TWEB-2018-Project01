# Swiss Devs Analytics

With Swiss Devs Analytics you should be able to find all Switzerland developers through an easy and interactive charts. You can:

- Find developers by cantons
- Filter developers by the language used on their repositories
- See developers details such as Username, Bio, Company etc.

## Architecture

Here is the global architecture of our projet:

![Architecture](https://github.com/mraheigvd/TWEB-2018-Project01/archi.png)


The project is divided in two main part:

- **swiss-dev-backend:** has two main functions:
    1) Feeder.js: this feeder will run every day and aggregate datas from Github into our MongoDB database
    2) App.js: will expose the API endpoints which permits to retrieve users by canton and filter by languages.

- **swiss-dev-frontend:** will simply fill the index.html with th data via the script **swiss-data.js** by calling the API endpoints.

### API Endpoints 

Here are the API endpoints:

GET ``/users/canton/count`` which will return an object with cantons keys and their number of users.

Example: ``curl --request GET https://API_ROOT_ENDPOINT/users/canton/count``


```
{  
   "ch-vd":81,
   "ch-vs":25,
   "ch-zg":197,
   "ch-zh":854,
}
```

GET ``/users/canton/:canton/language/:language`` which will return an array of users of a specific ``canton`` filtered by ``language``

Example: ``curl --request GET https://API_ROOT_ENDPOINT/users/canton/Vaud/language/JavaScript``

```
[
   {
      "languages":[
         "JavaScript",
         "HTML"
      ],
      "_id":"5bd5ca388aee86fe06982143",
      "username":"Mocha-test",
      "name":"Mocha-test",
      "company":"Mocha-test",
      "canton":"Vaud",
      "created":"2018-10-28T14:39:52.463Z",
      "__v":0
   }
]
```


GET ``/users/language/:language`` which will return an array of users filtered by ``language``

Example: ``curl --request GET https://API_ROOT_ENDPOINT/users/language/JavaScript``

```
[
   {
      "languages":[
         "JavaScript",
         "HTML"
      ],
      "_id":"5bd5ca388aee86fe06982143",
      "username":"Mocha-test",
      "name":"Mocha-test",
      "company":"Mocha-test",
      "canton":"Vaud",
      "created":"2018-10-28T14:39:52.463Z",
      "__v":0
   }
]
```


GET ``/users/canton/:canton`` which will return an array of all users located in canton ``canton``

Example: ``curl --request GET https://API_ROOT_ENDPOINT/users/canton/Vaud``

```
Formatted JSON Data
[  
   {  
      "_id":"5bc066a08a08486bbec9321a",
      "languages":[  
      ],
      "username":"DSI-Entreprises",
      "id_github":9963874,
      "profile_url":"https://api.github.com/users/DSI-Entreprises",
      "name":"DSI Référentiels domaine Entreprises",
      "company":"Etat-de-Vaud",
      "blog":"http://www.vd.ch",
      "hireable":null,
      "bio":null,
      "location":"Vaud, Suisse",
      "canton":"Vaud",
      "created":"2018-10-12T09:17:20.035Z",
      "__v":0
   }
]
```

## Tests

For our tests, we use Mocha for making our tests and Chai as the assertion library.

Tests covers only the swiss-dev-backend parts. You'll find these files under ``swiss-devs-backend/test``:

- ``api.js`` which will test the API endpoints used by the frontend
- ``database.js`` which will test all databases operations

## Install

For installing our project, you need first of all to clone our repo.
We use MLAB as our mongodb provider. Feel free to adapt the link via the app.js line 16 (this point will be improved in coming versions).

- You need to create a ``.env`` file in swiss-devs-backend folder with the following content: 

```
MONGO_USER=XXX
MONGO_PASS=YYY
MONGO_DB=ZZZ
GITHUB_TOKEN=GGGG
```

- Create an access token on Github for the Feeder an replace it with the **GITHUB_TOKEN**. Here is the KB related to this: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/

- Now, you have to install all project dependencies, so run: ``npm install`` 
- You can run test by simply running ``npm test`` from the swiss-devs-backend folder.
- You can run the server backend by running ``npm run nodemon``from the swiss-devs-backend folder also.