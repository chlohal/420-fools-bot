var fs = require("fs");
var https = require("https");

var fileUrlMapping = {};
try {
    fileUrlMapping = require("../data/image-urls.json");
} catch(e) {}

var authors = require("../data/authors.json");

var LAST_WRITE = Date.now();
var queue = [];

authors.forEach(x=>{
    x.images.forEach(x=>{

        if(!fileUrlMapping[x]) addRequestToQueue(makeFileURL(x), function(data) {
            var data = JSON.parse(data);
            var page = Object.values(data.query.pages)[0];
            fileUrlMapping[x] = page.imageinfo[0].url;

            if(Date.now() - LAST_WRITE > 1000) {
                LAST_WRITE = Date.now();
                fs.writeFileSync(__dirname + "/../data/image-urls.json", JSON.stringify(fileUrlMapping));
            }
        });
    })
});

function addRequestToQueue(url, cb) {
    queue.push([url, cb]);
}

var emptyLoops = 0;
var queueLoop = setInterval(function() {
    var item = queue.pop();
    if(item) {
        emptyLoops = 0;
        sendRequest(item[0], item[1]);
    } else {
        emptyLoops++;
        if(emptyLoops > 1000) {
            clearInterval(queueLoop);
        }
    }
}, 40);

function makeFileURL(file) {
    return `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&titles=${encodeURIComponent(file)}&iiprop=url`;
}

function sendRequest(url, cb) {

    var urlParsed = new URL(url);

    var options = {
        hostname: urlParsed.hostname,
        port: 443,
        path: urlParsed.pathname + urlParsed.search,
        method: "GET",
    };
    var req = https.request(options, res => {
        res.setEncoding("utf8");

        if(res.statusCode == 301) {
            return addRequestToQueue(res.headers.location, cb);
            
        }

        var body = "";

        res.on("data", chunk => {
            body += chunk;
        });
        res.on("end", () => {
            
            cb(body);
        });
    });

    req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}
