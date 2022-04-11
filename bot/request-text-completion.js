var https = require("https");

var config = require("./config");

var requestIsInFlight = false;

module.exports = function (promptText) {
    if(requestIsInFlight) return "";

    requestIsInFlight = true;

    return new Promise(function(resolve, reject) {
        var r = https.request({
            hostname: "api.deepai.org",
            path: "/api/text-generator",
            method: "POST",
            headers: {
                "api-key": config.AI_TEXT_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            
        }, function(res) {            
            var body = "";
            res.on("data", chunk => body += chunk);
            res.on("close", function() {
                requestIsInFlight = false;

                if (res.statusCode != "200") {
                    reject(`bad status code " + ${res.statusCode}\n${body}`);
                } else {
                    var j = JSON.parse(body);

                    if (typeof j.output != "string") reject("Bad body! \n" + body);
                    else resolve(j.output);
                }
            })
        });
        
        r.write(`text=${encodeURIComponent(promptText)}`, function() {
            r.end();
        });
    });
}