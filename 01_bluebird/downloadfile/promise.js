var fs = require('fs');
var request = require('request');
var promise = require('bluebird');

const photoLink = {
    link: 'https://unsplash.imgix.net/photo-1425235024244-b0e56d3cf907?fit=crop&fm=jpg&h=700&q=75&w=1050',
    name: 'dog2.jpg'
};

function getPhoto(photoLink) {
    return new Promise(function (fulfill, reject) {
        request.get(photoLink.link)
            .on('error', function (err) {
                err.photo = photoLink.link;
                reject(err);
            })
            .pipe(fs.createWriteStream('./downloadfile/' + photoLink.name)
                .on('finish', function () {
                    fulfill(photoLink.name);
                })
                .on('error', function (err) {
                    reject(err);
                })
            );
    });
}

getPhoto(photoLink)
    .then(function (result) {
        console.log('Done write to file', result);
    }).catch(function (err) {
        console.error('Error: ', err.message);
    });