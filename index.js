var server = require("./server");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/click"] = requestHandlers.click;
handle["/postback"] = requestHandlers.postback;

server.start(handle);
