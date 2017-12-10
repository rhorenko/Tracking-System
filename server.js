var express = require('express');
var mongodb = require('mongodb');
var app = express();

//Enter MongoDB URL:
var url = 'mongodb://';
//var url = process.env.MONGODB_URI;

var offersColl;
var publishersColl;

//connect to database,  creates vars to point to the offers/ clicks collections
function start(handle) {

    mongodb.MongoClient.connect(url, function (err, database) {
        if (err) {
            throw err;
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var db = database;
            offersColl = db.collection('offers');
            clicksColl = db.collection('clicks');
            //console.log('Connection established to', url);
        }
        app.listen(process.env.PORT || 3000, function () {
            console.log('App listening')
        });
    });

    //save all parametes sent with the click/postback url and the relevant header details, forwards all to the click/postback handler:.

    app.get('/click', function (req, res) {
        console.log('Request for /click');        
        var requestInfo = {
            offer: parseInt(req.query.number),
            agent: req.headers['user-agent'],
            language: req.headers['accept-language'],
            ip: req.headers['x-forwarded-for'],            
            pub: parseInt(req.query.pub),
            subid: req.query.subid,
            status: 0 //sets status to 'clicked'
        }        
        console.log(requestInfo);
        handle['/click'](res, requestInfo, offersColl, clicksColl);
    });

    app.get('/postback', function (req, res) { 
        console.log('Request for /postback');
        handle['/postback'](res, req.query.sub, offersColl, clicksColl);
    });

    app.get('/redirect', function (req, res) {
        res.redirect(req.originalUrl.replace( req.path + '?', '')); 
        //console.log(req.originalUrl.replace( req.path + '?', ''));
        res.end();
    });

}
exports.start = start;