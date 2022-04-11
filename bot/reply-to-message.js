const { Message } = require("discord.js");

var generateReply = require("./generate-reply");
var profilePictures = require("./profile-pictures");
var getWebhookUrl = require("./get-webhook-url");
const sendReply = require("./send-webhook-reply");

var config = require("./config");

/**
 * 
 * @param {Message} message 
 */
module.exports = async function(message) {

    profilePictures.fillCacheForMessageAuthor(message);

    try {
        var reply = await generateReply(message);

        if(config.shouldNeverReplyToMessage(message)) {
            console.log(reply);
        } else {
            var webhookUrl = await getWebhookUrl(message.channel, reply);
            sendReply(webhookUrl, reply);
        }
    } catch(e) {
        console.error(e);
    }
    
    
}