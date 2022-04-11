var getCategoryToSendTo = require("./get-category-of-message");
var config = require("./config");
var getWebhookUrl = require("./get-webhook-url");
var randomFromGenre = require("./random-from-genre");
var sendQuote = require("./send-quote");
var client = new (require('discord.js').Client)();

client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", function(message) {
    if(!message.author.bot) {
        var sendCategory = getCategoryToSendTo(message);
        if(sendCategory) {
            var quote = randomFromGenre(sendCategory);
            getWebhookUrl(message.channel, quote, function(url) {
                sendQuote(url, quote);
            });
        }
    }
});


client.login(config.TOKEN);




//3



















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
 * @typedef {Object} Author
 * @property {string} author
 * @property {string} id
 * @property {string} wikiId
 * @property {string[]} images
 */

/**
 * @typedef {Quote[]} QuoteCollection
 */

/**
 * @typedef {Object} QuoteGenreMatchDescription
 * @property {QuoteGenreID} category
 * @property {number} coef
 * @property {RegExp[]} matched
 */