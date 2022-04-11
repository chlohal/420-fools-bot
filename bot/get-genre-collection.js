/**
 * @param {QuoteGenreID} genre
 * @returns {QuoteCollection}
 */
module.exports = function(genre) {
    return require("../data/genres/" + genre + ".json");
}