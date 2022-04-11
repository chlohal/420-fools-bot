var fs = require("fs");
var https = require("https");
var quotes = require("../data/quotes.json");

var authors = Array.from(new Set(quotes.map(x=>x.quoteAuthor)));

var authorsWithIDs = authors.map((x,i)=>({
    author: x,
    id: generateID(i)
}));

var finishedAuthors = 0;
var queue = [];

authorsWithIDs.forEach(x=>{
    addRequestToQueue(makeSearchURL(x.author), function(body) {
        var jsonBody = JSON.parse(body);
        try {
            var pages = Object.values(jsonBody.query.pages);
            var page = pages.filter(x=>x.images)[0];
            if(page) {
                x.wikiId = page.title;
                var images = page.images.map(y=>y.title);
                x.images = images;
            } else {
                x.wikiId = null;
                x.images = [];
            }
        } catch(e) {
            console.error(e);
        }

        console.log("Finished " + x.author + "; found " + x.images);
        
        finishedAuthors++;
        if(finishedAuthors >= authorsWithIDs.length) finalize();
    });
});

function finalize() {
    fs.writeFileSync(__dirname + "/../data/authors.json", JSON.stringify(authorsWithIDs));
}

function makeSearchURL(author) {
    return `https://www.wikidata.org/w/api.php?action=query&format=json&prop=images&generator=search&redirects=1&gsrsearch=${encodeURIComponent(author)}&gsrwhat=text`;
}

function generateID(i) {
    var hex = i.toString(16);
    var hexLength = hex.length;

    //make sure each hex ID is the same total length by padding with randomness
    var random = Math.random().toString(16).substring(2);

    return random.substring(1,12 - hexLength) + hex;
}

function addRequestToQueue(url, cb) {
    queue.push([url, cb]);
}

setInterval(function() {
    var item = queue.pop();
    if(item) {
        sendRequest(item[0], item[1]);
    }
}, 40);

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
