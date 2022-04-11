var config = require("./config");

/**
 * 
 * @param {string} messageContent 
 * @returns {import(".").QuoteGenreMatchDescription[]}
 */
module.exports = function (messageContent) {
    return config.categoryWakeWords().map(entry=>{
        var name = entry[0];

        var words = entry[1];
        if(words.length == 0) return [name, 0, []];

        var matchedWords = words.filter(x=>x.test(messageContent));
        var matchedPercent = matchedWords.length / config.percentMatchedWordsMax;

        var scaledPercent = 1 + Math.cbrt(matchedPercent);

        return [name, scaledPercent, matchedWords];
    }).sort((a, b)=>(b[1] - a[1]) || (Math.random()-0.5)) //sort descending; break ties randomly
    .map(x=>({category: x[0], coef: x[1], matched: x[2]}));
}