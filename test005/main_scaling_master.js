const fs = require('fs');
const child_process = require('child_process');

console.time("total");

for (var i = 0; i < 8; i++) {
    test(i + "", callbackTest);
}

function test(data, callback) {
    console.log(data);
    console.time("console" + data);

    var cmd = 'ls';
    child_process.exec(cmd, function (err, stdout, stderr) {
        // call extraArgs with the "data" param and a callback as well
        extraArgs(err, stdout, stderr, data, callback)
    })
}

function extraArgs(err, stdout, stderr, data, callback) {
    callback(data);
}

function callbackTest(data) {
    console.log("End " + data);
    console.timeEnd("console" + data);
}

console.timeEnd("total");