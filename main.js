var Request = require("request");
var zlib = require("zlib");


var args = process.argv.slice(2);

if(args.length !== 2)
{
    console.log("Must specify Insights key and RPM ID");
    process.exit(-1);
}


//HTTP Request for API

var queue1Staleness = 1;
var queue2Staleness = 4;

var body = JSON.stringify([
        {
            "eventType":"RabbitMQStaleEvent",
            "AppName": "App1",
            "RabbitMQServer": "RabbitMQ1",
            "queueName":"Queue1",
            "value":queue1Staleness
        },
        {
            "eventType":"RabbitMQStaleEvent",
            "AppName": "App1",
            "RabbitMQServer": "RabbitMQ1",
            "queueName":"Queue2",
            "value":queue2Staleness,
            "depth": 2000
        }
    ]

)

var insightsURL = "https://insights-collector.newrelic.com/v1/accounts/" +args[1] + "/events";


 zlib.gzip(body, function (error, gzipbody) {
    if (error) throw error;
    console.log(gzipbody);
     Request.post({
         "headers": {"content-type": "application/json", "X-Insert-Key": args[0], "Content-Encoding": "gzip"  },
         "url": insightsURL,
         "body":gzipbody
     }, (error, response, body) => {
         if(error) {
             return console.dir(error);
         }
         console.dir(JSON.parse(body));
     });

 })




