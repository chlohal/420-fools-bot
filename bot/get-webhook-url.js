const { Webhook, TextChannel } = require("discord.js");
var fs = require("fs");
const { config } = require("process");
const findQuoteAuthor = require("./find-quote-author");
const makePfpUrl = require("./make-pfp-url");

var saveFile = __dirname + "/savedata/webhooks.json";

if(!fs.existsSync(saveFile)) fs.writeFileSync(saveFile, "{}");

var savedWebhooks = require(saveFile);


/**
 * 
 * @param {TextChannel} channel 
 * @param {import(".").Quote} quote 
 * @param {Function} cb 
 */
module.exports = async function(channel, quote, cb) {
    
    var webhook = await channel.createWebhook(quote.quoteAuthor, makePfpUrl(findQuoteAuthor(quote)) || config.defaultAvatar);
    var url = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;

    savedWebhooks[channel.id] = url;
    try {
    fs.writeFileSync(saveFile, JSON.stringify(savedWebhooks));
    } catch(e) {
        console.error(e);
        console.error("hehe");
    }
    cb(url);

    setTimeout(function() {
        webhook.delete();
    }, 2000);
}