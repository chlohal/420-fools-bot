const { Message } = require("discord.js");

var config = require("./config");

var https = require("https");

/**
 * @param {Message} message
 * @returns {import(".").reply}
 */
module.exports = async function(message) {
    var processingPrompt = await makePromptFromMessage(message);
    
    return makeReplyFromPrompt(processingPrompt);
}

async function makePromptFromMessage(message) {
    var messages = await message.channel.fetchMessages({ limit: config.contextMessageCount() });

    var processingPrompt = messages.array()
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map(x => formatMessageForAIProcessing(x))
        .join("\n") + "\n";
    
    return processingPrompt;
}

async function makeReplyFromPrompt(promptText) {
    var plainReply = await requestAiServer(promptText);
    
    if(!plainReply.startsWith(promptText)) throw "Something went wrong on the generator's side.";
    
    var newText = plainReply.substring(promptText.length);
    
    console.log(promptText);
    
    return parseReply(newText);
}

function parseReply(newText) {
    var messages = newText.split("\n");
    var reply = parseMessage(messages[0]);
    
    console.log(reply);
    
}

function parseMessage(message) {
    message = message.trim();
    //the default format: [hh:mm] nnnnnnn: msgmsgmsgmsgmsg
    var defaultForm = /$\[\d\d:\d\d\] ([^:]+): (.+)^/.exec(message);
    if(defaultForm) {
        return {
            authorName: defaultForm[1],
            text: defaultForm[2]
        }
    }
    
    //the angle bracket irc-esque format: <nnnnnn> msgmsgmsgmsgmsgmsg
    var angleBracketForm = /$<([^>]+)> (.+)/.exec(message);
    if(angleBracketForm) {
        return {
            authorName: defaultForm[1],
            text: defaultForm[2]
        }
    }
    
}

function requestAiServer(promptText) {
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
                if (res.statusCode != "200") reject(`bad status code " + ${res.statusCode}\n${body}`);
                
                var j = JSON.parse(body);
                
                if (typeof j.output != "string") reject("Bad body! \n" + body);
                else resolve(j.output);
            })
        });
        
        r.write(`text=${encodeURIComponent(promptText)}`, function() {
            r.end();
        });
    });
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