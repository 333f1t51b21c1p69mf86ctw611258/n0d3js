var promise = require("bluebird");
var needle = require("needle");

promise.promisifyAll(needle);

const TASK_A = 'TASK_A';

console.time(TASK_A);

needle.getAsync('http://ip.jsontest.com/').then(function (response) {
    return response.ip;
}).then(function (ip) {
    return needle.getAsync('http://www.geoplugin.net/json.gp?ip=' + ip);
}).then(function (response) {
    console.log(response.body);
    console.timeEnd(TASK_A);
}).catch(function (e) {
    console.error('Error:' + e);
});