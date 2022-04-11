const { User } = require("discord.js");


var path = require("path");
var fs = require("fs");

var savedataPath = path.join(__dirname, "../savedata/uploaded-images.json");
if(!fs.existsSync(savedataPath)) fs.writeFileSync(savedataPath, "{}");


var cache = require(savedataPath);

module.exports = {
    saveForUser: saveForUser,
    getUrl: getUrl,
    getHash: getHash
}

function getUrl(name) {
    return cache[name] && cache[name].url;
}

function getHash(name) {
    return cache[name] && cache[name].hash;
}

function saveForUser(name, hash, url) {
    cache[name] = { hash: hash, url: url };
    fs.writeFileSync(savedataPath, JSON.stringify(cache));

}

