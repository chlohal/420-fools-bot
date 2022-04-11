var https = require("https");

module.exports = function (url, replyMessage) {

    var message = {
        content: replyMessage.text,
        username: replyMessage.author.name,
        avatar_url: replyMessage.author.profileImage
    };

    sendWebhookRequest(url, message);
}

function makeOptions(url) {
    var urlParsed = new URL(url);
    var sendOptions = {
        hostname: urlParsed.hostname,
        port: 443,
        path: urlParsed.pathname,
        method: "POST",
    };
    return sendOptions;
}

function sendWebhookRequest(url, body) {
    var req = https.request(makeOptions(url), res => { });

    req.setHeader("Content-Type", "application/json");

    req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(body));
    req.end();
}