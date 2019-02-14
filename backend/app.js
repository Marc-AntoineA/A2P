var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3000;

app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', 'origin');
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.listen(port);
