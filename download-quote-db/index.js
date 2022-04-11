var fs = require("fs");
var http = require("http");

var quotes = [];

function downloadPage(pageNumber) {
    var options = {
        hostname: "quote-garden.herokuapp.com",
        port: 80,
        path: "/api/v3/quotes?limit=10000&page=" + pageNumber,
        method: "GET",
    };
    var req = http.request(options, res => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding("utf8");

        var body = "";

        res.on("data", chunk => {
            body += chunk;
        });
        res.on("end", () => {
            var jsonBody = JSON.parse(body);
            quotes = quotes.concat(jsonBody.data);
            if(jsonBody.pagination.nextPage) {
                downloadPage(jsonBody.pagination.nextPage);
            } else {
                fs.writeFileSync("./quotes.json", JSON.stringify(quotes));
            }
        });
    });

    req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}

downloadPage(1);


