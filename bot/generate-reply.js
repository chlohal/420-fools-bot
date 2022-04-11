const { Message } = require("discord.js");

var config = require("./config");
const profilePictures = require("./profile-pictures");

var requestTextCompletion = require("./request-text-completion");

/**
 * @param {Message} message
 * @returns {import(".").reply}
 */
module.exports = async function(message) {
    console.log("generating reply...");
    var processingPrompt = await makePromptFromMessage(message);
    
    return tryToComposeReply(processingPrompt, message);
}

async function makePromptFromMessage(message) {
    var messages = await message.channel.fetchMessages({ limit: config.contextMessageCount() });

    var processingPrompt = messages.array()
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map(x => formatMessageForAIProcessing(x))
        .join("\n") + "\n";
    
    return processingPrompt;
}

async function tryToComposeReply(prompt, message) {
    for(var i = config.textgenRetryTimes(); i >= 0; i--) {
        try {
            return makeReplyFromPrompt(prompt, message);
        } catch(e) {} 
        console.log("Bad format. Trying again.");
    }
    return makeReplyFromPrompt(prompt, message);
}

async function makeReplyFromPrompt(promptText, message) {
    var plainReply = await requestTextCompletion(promptText);
    
    if(!plainReply.startsWith(promptText)) throw "Something went wrong on the generator's side.";
    
    var newText = plainReply.substring(promptText.length);
    
    return parseReply(newText, message);
}

async function parseReply(newText, message) {
    var messages = newText.trim().split("\n");

    var reply = await parseMessage(messages[0]);

    var profilePictureUrl = await profilePictures.getUrlForMessageAuthor(message);
    if(!profilePictureUrl) profilePictureUrl = config.placeholderImageUrl();
    
    reply.author = {
        name: '"' + reply.authorName.trim() + '"',
        profileImage: profilePictureUrl
    }

    return reply;
}

async function parseMessage(message) {
    message = message.trim();
    //the default format: [hh:mm] nnnnnnn: msgmsgmsgmsgmsg
    var defaultForm = /^\[\d\d:\d\d\] ([^:]+): (.+)$/.exec(message);
    if(defaultForm) {
        return {
            authorName: defaultForm[1],
            text: defaultForm[2]
        }
    }
    
    //the angle bracket irc-esque format: <nnnnnn> msgmsgmsgmsgmsgmsg
    var angleBracketForm = /^<([^>]+)> (.+)$/.exec(message);
    if(angleBracketForm) {
        return {
            authorName: defaultForm[1],
            text: defaultForm[2]
        }
    }

    throw "bad format! :/";
}



/**
 * 
 * @param {Message} message
 */
function formatMessageForAIProcessing(message) {
    var hh = pad0(message.createdAt.getHours(), 2);
    var mm = pad0(message.createdAt.getMinutes(), 2);
    var name = message.member.nickname || message.author.username;
    
    return `[${hh}:${mm}] ${name}: ${message.content}`;
}

function pad0(t, n) {
    t += ""
    while(t.length < n) t = "0" + t;
    return t;
}