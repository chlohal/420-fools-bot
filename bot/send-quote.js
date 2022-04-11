var findQuoteAuthor = require("./find-quote-author");
var makePfpUrl = require("./make-pfp-url");
var https = require("https");

/**
 * @param {string} url
 * @param {Quote} quote 
 */
module.exports = function (url, quote) {

    if(!quote) return;

    var author = findQuoteAuthor(quote);

    var message = {
        content: quote.quoteText,
        username: quote.quoteAuthor,
        avatar_url: makePfpUrl(author)
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