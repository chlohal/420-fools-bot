var rollingWindowMessageCount = require("./rolling-window-message-count");
var getCategoryAffinities = require("./get-category-affinities");
var config = require("./config");
/**
 * 
 * @param {Message} message 
 * @return {import(".").QuoteGenreMatchDescription}
 */
var lastSend = 0;
module.exports = function(message) {
    rollingWindowMessageCount.add(message);
    var messagesInLast12Min = rollingWindowMessageCount.count();
    var timeSinceLastSend = Date.now() - lastSend;

    var categoryAffinities = getCategoryAffinities(message.content);

    var chanceOfSend = (categoryAffinities[0].coef / Math.max(12, messagesInLast12Min)) * config.sendingChanceCoefficient();

    console.log("chance", chanceOfSend);

    var shouldSend = timeSinceLastSend > config.cooldown() && Math.random() < chanceOfSend;

    if(shouldSend) {
        lastSend = Date.now();
        return categoryAffinities[0];
    }
}