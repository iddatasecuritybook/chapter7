var fs = require('fs'),
    https = require('https'),
    querystring = require('querystring'),
    bodyParser = require('body-parser')
    app = require('express')();

//support JSON & URL encoded bodies
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({     
    extended: true
})); 

//handle all POST requests
app.post('/', function (req, res){
    var message = req.body;
    res.send('Message received:' + querystring.stringify(message));
});

//set certificate options
var options = {
   key: fs.readFileSync('server.key'),
   cert: fs.readFileSync('server.crt'),
   passphrase: 'YOUR KEY PASSWORD' 
};

//create server with certificate options
https.createServer(options, app).listen(3000, function () {
   console.log('Server started: Listening on port 3000');
});
