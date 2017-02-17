var express = require("express");
var app = express();

app.get("/", function(req, res) {
   res.send("test test test");
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at: http://%s:%s", host, port);
});