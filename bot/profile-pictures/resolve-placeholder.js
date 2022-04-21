var crypto = require("crypto");
const config = require("../config");


module.exports = async function(name) {
    return config.placeholderImageUrl() + "?cache-bust=" + sha(name);
};

function sha(s) {
    return crypto.createHash("sha1").update(s + "").digest("hex");
}