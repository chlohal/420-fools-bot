const { Webhook, TextChannel } = require("discord.js");

var savedWebhooks = {};

/**
 * 
 * @param {TextChannel} channel 
 * @param {import(".").Quote} quote 
 * @param {Function} cb 
 */
module.exports = function(channel, quote) {
    
    return new Promise(async function(resolve, reject) {
        if(savedWebhooks[channel.id]) {
            resolve(savedWebhooks[channel.id]);
        } else {
            var webhook = await channel.createWebhook(quote.author.name, quote.author.profileImage);
            var url = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;

            savedWebhooks[channel.id] = url;
        
            resolve(url);

            setTimeout(function() {
                webhook.delete();
                delete savedWebhooks[channel.id];
            }, 60_000);
        }
    });
}