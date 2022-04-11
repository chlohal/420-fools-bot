var fs = require("fs");
var https = require("https");

var fileUrlMapping = require("../data/image-urls.json");
var authors = require("../data/authors.json");

var LAST_WRITE = Date.now();
var queue = [];

authors.forEach(x=>{
    if(x.images.length == 0) return;

    var selectedImageIndex = x.images.length - 1;
    var selectedImage = x.images[selectedImageIndex];

    //prefer to not use signatures or graves
    while(selectedImageIndex > 0 && (selectedImage.match(/\bsignature\b/i) || selectedImage.match(/\bgrave\b/i))) {
        selectedImageIndex--;
        selectedImage = x.images[selectedImageIndex];
    }

    var fileExtension = selectedImage.substring(selectedImage.lastIndexOf("."));
    addRequestToQueue(fileUrlMapping[selectedImage], function(body) {
        fs.writeFileSync(__dirname + "/../data/authorimages/" + x.id + fileExtension, body);
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
        if(emptyLoops > 30) {
            clearInterval(queueLoop);
        }
    }
}, 1000);


function sendRequest(url, cb) {

    var urlParsed = new URL(url);

    var options = {
        hostname: urlParsed.hostname,
        port: 443,
        path: urlParsed.pathname + urlParsed.search,
        method: "GET",
    };
    var req = https.request(options, res => {

        if(res.statusCode == 301) {
            return addRequestToQueue(res.headers.location, cb);
        } else if(res.statusCode != 200) {
            setTimeout(function() {
                addRequestToQueue(url, cb);
            }, 5000);
            return;
        }

        var chunks = [];

        res.on("data", chunk => {
            chunks.push(chunk)
        });
        res.on("end", () => {
            
            cb(Buffer.concat(chunks));
        });
    });

    req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}
