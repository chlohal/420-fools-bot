var jimp = require("jimp");
var cache = require("./cache");
const hashKeyUser = require("./hash-key-user");
var uploadImage = require("./upload-image");

/**
 * 
 * @param {*} name 
 * @param {User} user 
 */
 module.exports = async function(name, user) {
    var imageUrl = user.avatarURL.replace(/.\w+\?size=\d+$/, ".png?size=100")
    var img = await jimp.read(imageUrl);
    img.greyscale();

    var uploaded = await uploadImage(await img.getBufferAsync("image/png"), name);

    cache.saveForUser(name, hashKeyUser(user), uploaded);
}