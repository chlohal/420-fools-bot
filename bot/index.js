var shouldReply = require("./should-reply-to-message");
var config = require("./config");
//var getWebhookUrl = require("./get-webhook-url");
//var randomFromGenre = require("./random-from-genre");
var replyTo = require("./reply-to-message");
var client = new (require('discord.js').Client)();

client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", async function(message) {
    if (await shouldReply(message)) replyTo(message);
    
    //    getWebhookUrl(message.channel, quote, function(url) {
    //        sendQuote(url, quote);
    //    });
});


client.login(config.TOKEN);



/**
 * @typedef {Object} Quote
 * @property {string} _id
 * @property {string} quoteText
 * @property {string} quoteAuthor
 * @property {QuoteGenreID} quoteGenre
 * @property {0} __v
 */

/**
 * @typedef {"age"|"car"|"education"|"forgiveness"|"health"|"legal"|"music"|"religion"|"technology"|"alone"|"change"|"environmental"|"freedom"|"history"|"life"|"nature"|"respect"|"teen"|"amazing"|"communication"|"equality"|"friendship"|"home"|"love"|"parenting"|"romantic"|"thankful"|"anger"|"computers"|"experience"|"funny"|"hope"|"marriage"|"patience"|"sad"|"time"|"anniversary"|"cool"|"failure"|"future"|"humor"|"medical"|"patriotism"|"science"|"travel"|"architecture"|"courage"|"faith"|"gardening"|"imagination"|"men"|"peace"|"smile"|"trust"|"art"|"dad"|"family"|"god"|"inspirational"|"mom"|"pet"|"society"|"truth"|"attitude"|"dating"|"famous"|"good"|"intelligence"|"money"|"poetry"|"sports"|"war"|"beauty"|"death"|"fear"|"government"|"jealousy"|"morning"|"politics"|"strength"|"wedding"|"best"|"design"|"finance"|"graduation"|"knowledge"|"motivational"|"positive"|"success"|"birthday"|"diet"|"fitness"|"great"|"leadership"|"movies"|"power"|"sympathy"|"business"|"dreams"|"food"|"happiness"|"learning"|"movingon"|"relationship"|"teacher"} QuoteGenreID
 */

/**
 * @typedef {Object} Reply
 * @property {Author} author
 * @property {string} text
 */

/**
 * @typedef {Object} Author
 * @property {string} name
 * @property {string} profileImageUrl
 */