var fs = require('fs');
var promise = require('bluebird');

console.time("promise");
promise.promisifyAll(fs);
console.timeEnd('promise');

fs.readFileAsync('./readfile/default.json').then(JSON.parse).then(function (json) {
    console.log(json);
}).catch(SyntaxError, function (e) {
    console.error('invalid json in file', e.message);
}).catch(function (e) {
    console.error('unable to read file', e.message);
});
