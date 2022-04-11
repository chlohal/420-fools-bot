const { Message } = require("discord.js");
var config = require("./config");
/**
 * 
 * @param {Message} message 
 * @return {import(".").QuoteGenreMatchDescription}
 */
var chance = config.initialChance();
var lastSendTime = 0;
module.exports = async function shouldReply(m) {
    /**@type {Message} */
    var message = m;
    
    if(message.author.bot) return false;
    if (!messageIsPlain(message)) return false;
    
    var contextMessages = await message.channel.fetchMessages({ limit: config.contextMessageCount() });
    var cMsgArr = contextMessages.array;

    for(var i = 0; i < cMsgArr.length; i++) {
        if(!messageIsPlain(cMsgArr[i])) return false;
    }
    
    if(Date.now() - lastSendTime < config.cooldown()) return false;
    
    if (Math.random() < chance) {
        chance = config.initialChance();
        lastSendTime = Date.now();
        return true;
    } else {
        chance *= config.chanceCoefficientOnFail();
        return false;
    }
}


/**
 * 
 * @param {Message} message 
 */
function messageIsPlain(message) {
    return message.type == "DEFAULT" && message.attachments.size == 0 && message.content.indexOf("\n") == -1;
}