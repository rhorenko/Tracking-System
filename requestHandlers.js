var database = require("./database");
var http = require('http');
var https = require('https');
const url = require('url');

//sends click data to database, redirects the requests to the url that fits the clicked offer with the clickID
function click(response, requestInfo, offersColl, clicksColl) {    
    database.make(requestInfo, offersColl, clicksColl, function (result) { 
        if (result) {
            console.log("Database received click to offer number: " + requestInfo.offer + ' from pub id: ' + requestInfo.pub + ' and subid: ' + requestInfo.subid + ' redirecting to: ' + result);
            response.writeHead(302, { 'Location': '/redirect?'+result });            
        }
        else {
            response.write("offer not found");
        }
        response.end();
    });
}

//takes the clickID received in the postback url parameter and sends it to the DB to find the corresponding publisher clickID, update the to 'lead' status.
//gets the publishers postback url from the pubs database and sends a postback to the publisher with his clickID
function postback(response, clickid, offersColl, clicksColl) {
    database.post(clickid, offersColl, clicksColl, function (result,r) {
        console.log('Received click id belongs to pub: ' + result[0][['pub']] + ' for offer ' + result[0][['offer']]);
       
        database.pubsUrl(result[0][['pub']], function (res) {
            const postback = url.parse(res[0][['postback']]);
            //console.log('Postback will be sent to: ' + postback.protocol+'//'+postback.hostname+'/'+postback.path+result[0][['subid']]);
            //postbackUrl should be http://www.example.com/path?{subParam}=   and can include port (for testing localy)
            if(postback.protocol == 'http:') {   
                http.get({ protocol: postback.protocol, port: postback.port, hostname: postback.hostname, path: postback.path+result[0][['subid']] }, function (resp) {            
                    console.log('Posback sent to ' + postback.protocol+'//'+postback.hostname+'/'+postback.path+result[0][['subid']] + ' status: ' + resp.statusCode);
                }).on("error", function (e) {
                    console.log("Got error: " + e.message);
                });
            }
            else if(postback.protocol == 'https:') {   
                https.get({ protocol: postback.protocol, port: postback.port, hostname: postback.hostname, path: postback.path+result[0][['subid']] }, function (resp) {            
                    console.log('Posback sent to ' + postback.protocol+'//'+postback.hostname+'/'+postback.path+result[0][['subid']] + ' status: ' + resp.statusCode);
                }).on("error", function (e) {
                    console.log("Got error: " + e.message);
                });
            }
            else {
                console.log('Error: no protocol in postback URL');
            }
        });

    });
    response.writeHead(200);
    //response.write("postback recieved for click ID: " + clickid);
    response.end();
}

exports.click = click;
exports.postback = postback;
