var authors = require("../data/authors.json");

/**
 * 
 * @param {Quote} quote 
 * @returns {Author}
 */
module.exports = function(quote) {
    var authorName = quote.quoteAuthor;
    for(var i = 0; i < authors.length; i++) {
        if(authorName == authors[i].author) return authors[i];
    }
    return null;
}