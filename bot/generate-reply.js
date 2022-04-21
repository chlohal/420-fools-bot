const { Message } = require("discord.js");

var config = require("./config");
const profilePictures = require("./profile-pictures");
const otherUsers = require("./extra-users");

var requestTextCompletion = require("./request-text-completion");

/**
 * @param {Message} message
 * @returns {import(".").reply}
 */
module.exports = async function(message) {
    console.log("generating reply...");
    var processingPrompt = await makePromptFromMessage(message);

    console.log(processingPrompt);
    
    return tryToComposeReply(processingPrompt.promptText, processingPrompt.ungarbledUserMap, message);
}

async function makePromptFromMessage(message) {
    var messages = await message.channel.fetchMessages({ limit: config.contextMessageCount() });

    var garbledUserMap = {};

    var processingPrompt = messages.array()
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map(x => formatMessageForAIProcessing(x, garbledUserMap))
        .join("\n") + "\n";
    
    return {
        promptText: processingPrompt,
        ungarbledUserMap: invertMap(garbledUserMap)
    };
}

function invertMap(map) {
    var m = {};
    Object.entries(map).forEach(kv=> m[kv[1]] = kv[0]);
    return m;
}

async function tryToComposeReply(prompt, ungarbledUserMap, message) {
    for(var i = config.textgenRetryTimes(); i >= 0; i--) {
        try {
            return makeReplyFromPrompt(prompt, ungarbledUserMap, message);
        } catch(e) {} 
        console.log("Bad format. Trying again.");
    }
    return makeReplyFromPrompt(prompt, ungarbledUserMap, message);
}

async function makeReplyFromPrompt(promptText, ungarbledUserMap, message) {
    var plainReply = await requestTextCompletion(promptText);
    
    if(!plainReply.startsWith(promptText)) throw "Something went wrong on the generator's side.";
    
    var newText = plainReply.substring(promptText.length);
    
    return parseReply(newText, ungarbledUserMap, message);
}

async function parseReply(newText, ungarbledUserMap, message) {
    var messages = newText.trim().split("\n");

    var reply = await parseMessage(messages[0]);

    var realAuthorName = reply.authorName.trim();

    //TODO: make garbling better
    //realAuthorName = ungarbledUserMap[reply.authorName.trim()];
    //if(!realAuthorName) realAuthorName = otherUsers.getNewUserFor(reply.authorName);

    var profilePictureUrl = await profilePictures.getUrlForName(realAuthorName);
    if(!profilePictureUrl) profilePictureUrl = await profilePictures.resolvePlaceholder(realAuthorName);
    
    reply.author = {
        name: realAuthorName,
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
function formatMessageForAIProcessing(message, garbledUserMap) {
    var hh = pad0(message.createdAt.getHours(), 2);
    var mm = pad0(message.createdAt.getMinutes(), 2);
    var name = (message.member && message.member.nickname) || message.author.username;

    //TODO: make garbling work
    //var garbledName;
    //if(garbledUserMap[name]) garbledName = garbledUserMap[name];
    //else garbledName = garbledUserMap[name] = otherUsers.getIndex(Object.keys(garbledUserMap).length);
    
    return `[${hh}:${mm}] ${name}: ${message.content}`;
}

function pad0(t, n) {
    t += ""
    while(t.length < n) t = "0" + t;
    return t;
}