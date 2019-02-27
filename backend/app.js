const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const settings = require('./settings.json');
const applicantRoutes = require('./routes/applicant');

// ONLY FOR TESTS (TODO REMOVE)
//require('./models/mongoose');

const app = express();
const port = settings.PORT;

app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', 'origin');
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/applicant-api/', applicantRoutes);

app.listen(port);

module.exports = app;
