# Tracking-System

Tracking system back-end for affilate marketing. 

## Getting Started

Live system deployment on Heroku : https://evening-earth-23557.herokuapp.com/login
username: yuval
password: yuval

See also Tracking-System-UI.


### Prerequisites

* Node.js 
* Express.js 
* MongoDB 

Insert campaigns and publishers data into database using the following format example:
```
offers:
{
    "_id" : ObjectId("589efed936382d13c8f516b5"),
    "name" : "War Song of Dark – CN - Non-Incent",
    "icon" : "http://is5.mzstatic.com/image/thumb/Purple82/v4/7e/e1/11/7ee11198-40af-5e76-dc24-22201a41a68f/source/40x40.jpg",
    "number" : 1,
    "their" : 25676,
    "landing" : "https://itunes.apple.com/cn/app/id1226887782",
    "Incent" : "Non Incent",
    "merchant" : "merchant name",
    "details" : "retention rate > 30%",
    "rate" : 1.4,
    "street" : 1.4,
    "cap" : 50,
    "device" : "iOS",
    "geo" : "us",
    "os" : "ios9up",
    "lang" : "en-UK",
    "tracking" : "/click?"
}

publishers: 
{
    "_id" : ObjectId("597068b7734d1d6202a74838"),
    "name" : 3,                                       
    "postback" : "www.example.com/postback?sub="
}
```
### Installing

Add your MongoDB URL in server.js and datababe.js (line 6):
```
var url = 'mongodb://...';
```
Run index.js: 
```bash
node index.js
```

Open local host port 3000 in browser:
```
http://localhost:3000/
```

## Running 

Edit the parameters in the affilate link:
```
http://localhost:3000//click?number={offer#}&pub={pub#}&subid={publishers_clickID}
```
When a click is received the relevant data is saved to the databese and the request is redirected to the offer URL

```
http://localhost:3000//postback?sub={Mongo ObjectId (clickID)}
```
When a postback is received, the click status is changed to 'lead' and the offer payout is added to the click data.
A postback (http request) is sent to the publishers URL with his click ID.

Example of click record in database:
```
clicks:
{
    "_id" : ObjectId("5a07fb572229cb2614dffc8e"),
    "offer" : 2,
    "agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0",
    "language" : "en-US,en;q=0.5",
    "ip" : null,
    "pub" : 1,
    "subid" : "12345",
    "status" : 1,
    "clicktime" : ISODate("2017-11-12T07:42:15.796Z"),
    "rate" : 0.8,
    "leadTime" : ISODate("2017-11-12T07:43:20.954Z")
}
```
# Deployment 

Deployment on Heroku requires Procfile 
