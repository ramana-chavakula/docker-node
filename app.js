'use strict';
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = process.env.PORT || 9511;
let corsHandler = require('./utils/cors.js');
let authTokenInterceptor = require('./utils/authTokenInterceptor.js');
let postRoutes = require('./posts/posts.routes.js');
let authenticationRoutes = require('./authentication/authentication.routes.js');
let authentication = require('./authentication/authentication.js');
const Config = require('./config.js');

//to serve static files
app.use(express.static(__dirname));
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
//enabling cors
app.use(corsHandler);
app.use(authTokenInterceptor);
app.use('/', authenticationRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, function () {
  console.log('Express server started on port : ' + port);
  setInterval(authentication.removeExpiredTokens, Config.removeExpiredTokensTimer);
});