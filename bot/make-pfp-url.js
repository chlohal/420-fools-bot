var imageTypes = require("../data/author-image-types.json");

/**
 * 
 * @param {Author} author 
 * @returns {string}
 */
module.exports = function(author) {
    return `https://april.nhs.gg/authors/${author.id}.${imageTypes[author.id]}`;
}