var d = require("./data.json");
module.exports = {
    getNewUserFor: function(garbledAuthorName) {
        return d[Math.floor(Math.random() * d.length)];
    },
    getIndex: function(i) {
        return d[i] || this.getNewUserFor("");
    }
}