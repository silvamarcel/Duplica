const functions = require('firebase-functions');
const express = require('express');

const api = require('./api');

const app = express();

// Setup the api routes
app.use('/', api);

exports.api = functions.https.onRequest(app);
