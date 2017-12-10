var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var MongoClient = mongodb.MongoClient;

//Enter MongoDB URL:
var url = 'mongodb://';
//var url = process.env.MONGODB_URI;


function make(click, offersColl, clicksColl, fn) { //insert click to database, finds offer tracking link, returns redirect url together with the created click id    
    //console.log("request for 'click' was called with offer number: " + click.offer);
    click.clicktime = new Date();
    clicksColl.insert(click, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            var redirect;
            offersColl.find({ 'number': click.offer }, { 'tracking': 1 }).toArray(function (err, res) {
                if (err) {
                    console.log(err);
                } else if (res.length) {
                    //console.log('Found:', result);  
                    var str = res[0]['tracking']
                    var newstr = str.replace(/%click%/g, result.insertedIds[0]);
                    fn(newstr);
                } else {
                    console.log('Click received to non existing offer number');
                    fn(false);
                }
            });
            //    console.log('Inserted documents into the "clicks" collection. The documents inserted with "_id" are:', result.length, result);
        }
    });
}

function post(clickid, offersColl, clicksColl, fn) { //update status from 'click' to 'lead'. Adds payout for lead. finds the publishers subid.
    console.log("updating database id " + clickid + ' to lead status');
    //error with incorrect ObjectId                          
    clicksColl.find({ '_id': ObjectId(clickid) }, { 'pub': 1, 'subid': 1, 'offer': 1}).toArray(function (err1, result) { 
        if (err1) {
            console.log(err1);
        }
        else if (result.length) {
            offersColl.find({ 'number': result[0]['offer'] }, { 'street': 1 }).toArray(function (err2, r) {
                if (err2) {
                    console.log(err2);
                }
                else if (r.length) { //update only if offer is found 
                    fn(result,r);                   
                    clicksColl.update({ '_id': ObjectId(clickid) }, { $set: { 'status': 1, 'rate': parseFloat(r[0]['street']), 'leadTime': new Date() } }, function (err3, numUpdated) {
                        if (err3) {
                            console.log(err3);
                        } else if (numUpdated) {
                            console.log('Updated lead and rate successfully ');
                        } else {
                            console.log('Error: clicked offer not found');
                        }
                    });
                }
            });           
        }
        else {
            console.log('click not found');
        }
    });
}


function pubsUrl(pubNumber, fn) { //finds publishers postback url
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //console.log('Connection established to', url);
            db.collection('publishers').find({ 'name': pubNumber }, { 'postback': 1 }).toArray(function (e, res) {
                if (e) {
                    console.log(e);
                }
                else if (res.length) {
                    //console.log(res); 
                    fn(res);
                }
                else {
                    console.log('No document(s) found with defined "find" criteria!');
                }
                db.close();
            });
        }
    });
}

exports.make = make;
exports.post = post;
exports.pubsUrl = pubsUrl;
