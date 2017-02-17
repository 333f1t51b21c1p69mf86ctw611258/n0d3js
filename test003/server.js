var express = require('express');
var app = express();
var fs = require("fs");

var data = null;

app.get('/listUsers', function (req, res) {
    if (data === null) {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
            data = JSON.parse( data );

            var stringify = JSON.stringify(data);
            console.log(stringify);
            res.end(stringify);
        });
    } else {
        var stringify = JSON.stringify(data);
        console.log(stringify);
        res.end(stringify);
    }
})

var user = {
    "user4" : {
        "name" : "mohit",
        "password" : "password4",
        "profession" : "teacher",
        "id": 4
    }
}

app.post('/addUser', function (req, res) {
    // First read existing users.

    if (data != null) {
        data["user4"] = user["user4"];
        console.log( data );
        res.end( JSON.stringify(data));
    } else {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
            data = JSON.parse( data );
            data["user4"] = user["user4"];
            console.log( data );
            res.end( JSON.stringify(data));
        });
    }
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});