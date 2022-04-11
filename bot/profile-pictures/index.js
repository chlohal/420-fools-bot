const { Message } = require("discord.js");
const cache = require("./cache");

var editImageForUser = require("./edit-image-for-user");
const hashKeyUser = require("./hash-key-user");


module.exports = {
    fillCacheForMessageAuthor: fillCacheForMessageAuthor,
    getUrlForMessageAuthor: getUrlForMessageAuthor
}

async function getUrlForMessageAuthor(message) {
    var name = nameOfAuthor(message);

    var url = cache.getUrl(name);
    if(!url) await fillCacheForMessageAuthor(message);
    return cache.getUrl(name);
}

/**
 * 
 * @param {Message} message
 */
async function fillCacheForMessageAuthor(message) {
    var name = nameOfAuthor(message);

    if(hashKeyUser(message.author) != cache.getHash(name)) {
        editImageForUser(name, message.author);
    }
}

function nameOfAuthor(message) {
    return message.member.nickname || message.author.username;
}