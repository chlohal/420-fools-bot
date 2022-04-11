const { Message } = require("discord.js");

var generateReply = require("./generate-reply");

/**
 * 
 * @param {Message} message 
 */
module.exports = async function(message) {
    var reply = await generateReply(message);
    
    
}