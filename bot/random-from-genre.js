var usedQuotes = require("./used-quotes");
var getGenreCollection = require("./get-genre-collection");

/**
 * 
 * @param {import(".").QuoteGenreMatchDescription} genre 
 * @returns {import(".").Quote}
 */
module.exports = function(genre) {
    var genreQuotes = getGenreCollection(genre.category);
    var quote = selectMatches(genreQuotes, genre.matched) || selectRandom(genreQuotes);

    var iterations = 0;

    while(usedQuotes.isAlreadyUsed(quote)) {
        quote = selectRandom(genreQuotes);

        iterations++;
        if(iterations > genreQuotes.length) return null;
    }
    usedQuotes.add(quote);
    return quote;
}

/**
 * 
 * @param {Quote[]} arr 
 * @returns {Quote}
 */
function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
/**
 * 
 * @param {import(".").Quote[]} arr 
 * @param {RegExp[]} regexps 
 */
function selectMatches(arr, regexps) {
    for(var i = 0; i < arr.length; i++) {
        var q = arr[i];
        for(var j = 0; j < regexps.length; j++) {
            if(regexps[j].test(q.quoteText)) return q;
        }
    }
}