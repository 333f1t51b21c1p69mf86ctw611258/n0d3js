var fs = require('fs');
var promise = require('bluebird');

console.time("promise");
var readFileAsync = promise.promisify(fs.readFile);
console.timeEnd('promise');

readFileAsync('./readfile/default.json').then(JSON.parse).then(function (json) {
    console.log(json);
}).catch(SyntaxError, function (e) {
    console.error('invalid json in file', e.message);
}).catch(function (e) {
    console.error('unable to read file', e.message);
});