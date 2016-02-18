var querystring = require('querystring'),
    https = require('https');

//POST data to be sent to server
var post_data = querystring.stringify({
    'message' : 'My secure JSON string'
});

//POST options
var post_options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    rejectUnauthorized: false,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
    }
};

//set up HTTPS POST request to server
var post_req = https.request(post_options, function(res){
    res.setEncoding('utf8');
    res.on('data', function (data){
        console.log(data);
    });
});

//POST data to server
post_req.write(post_data);
post_req.end();